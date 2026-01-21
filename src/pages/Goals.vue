<script setup lang="ts">
defineOptions({
  name: 'GoalsPage',
});

import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoalsStore } from 'src/stores/goals.store';
import type { Goal } from 'src/stores/goals.store';
import type { QTableColumn } from 'quasar';
import { Notify } from 'quasar';

const store = useGoalsStore();
onMounted(() => store.load());

const goals = computed<Goal[]>(() => store.goals);

const dialog = ref<boolean>(false);

const form = ref<Omit<Goal, 'id' | 'createdAt'> & { id?: number }>({
  title: '',
  description: '',
  category: 'Study',
  done: false,
  dueDate: new Date().toISOString().slice(0, 10),
});

const categoryColors: Record<Goal['category'], string> = {
  Study: 'primary',
  Health: 'positive',
  Business: 'orange',
  Personal: 'deep-purple',
};

const columns: QTableColumn<Goal>[] = [
  { name: 'title', label: 'Maqsad', field: 'title', align: 'left' },
  { name: 'category', label: 'Kategoriya', field: 'category', align: 'left' },
  { name: 'done', label: 'Holat', field: 'done', align: 'center' },
  { name: 'actions', label: '', field: () => '', align: 'right' },
];

// -------- STATUS LOGIC --------
function getStatus(goal: Goal) {
  if (goal.done) return { text: 'Bajarildi', color: 'positive' };
  if (new Date(goal.dueDate) < new Date()) return { text: 'Muddati o‘tgan', color: 'negative' };
  return { text: 'Jarayonda', color: 'orange' };
}

// deadline kelmaguncha belgilab bo‘lmaydi
function canToggle(goal: Goal): boolean {
  return new Date() >= new Date(goal.dueDate);
}

// -------- CRUD --------
function open(): void {
  form.value = {
    title: '',
    description: '',
    category: 'Study',
    done: false,
    dueDate: new Date().toISOString().slice(0, 10),
  };
  dialog.value = true;
}

function edit(goal: Goal): void {
  form.value = { ...goal };
  dialog.value = true;
}

async function save(): Promise<void> {
  if (form.value.id) {
    store.update(form.value as Goal);
    Notify.create({ type: 'positive', message: 'Maqsad yangilandi' });
  } else {
    store.add(form.value);
    Notify.create({ type: 'positive', message: 'Yangi maqsad qo‘shildi' });
  }

  await nextTick();
  dialog.value = false;
}

function removeGoal(id: number): void {
  store.remove(id);
  Notify.create({ type: 'negative', message: 'Maqsad o‘chirildi' });
}

function toggleGoal(id: number): void {
  store.toggle(id);
}
</script>

<template>
  <q-page padding class="bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">🎯 Mening maqsadlarim</div>
        <div class="text-grey-7">Maqsadlaringizni muddat bilan boshqaring</div>
      </div>
      <q-space />
      <q-btn color="primary" icon="add" label="Yangi maqsad" unelevated rounded @click="open" />
    </div>

    <!-- TABLE -->
    <q-card flat bordered class="table-card">
      <q-table
        :rows="goals"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 5 }"
        :rows-per-page-options="[5, 10, 25, 50, 100]"
        flat
      >
        <!-- TITLE -->
        <template #body-cell-title="props">
          <q-td>
            <div class="text-weight-medium" :class="props.row.done ? 'done-text' : ''">
              {{ props.row.title }}
            </div>
            <div class="text-grey-6 text-caption">
              {{ props.row.description || 'Izoh yo‘q' }}
            </div>
            <div class="text-caption text-grey-7">📅 {{ props.row.dueDate }}</div>
          </q-td>
        </template>

        <!-- CATEGORY -->
        <template #body-cell-category="props">
          <q-td>
            <q-badge
              :color="categoryColors[props.row.category as Goal['category']]"
              outline
              class="q-px-sm q-py-xs"
            >
              {{ props.row.category }}
            </q-badge>
          </q-td>
        </template>

        <!-- STATUS -->
        <template #body-cell-done="props">
          <q-td align="center">
            <div class="column items-center q-gutter-xs">
              <q-badge :color="getStatus(props.row).color" outline>
                {{ getStatus(props.row).text }}
              </q-badge>

              <q-toggle
                :model-value="props.row.done"
                :disable="!canToggle(props.row)"
                @update:model-value="() => toggleGoal(props.row.id)"
                color="positive"
                dense
              />

              <div v-if="!canToggle(props.row)" class="text-caption text-grey-6">
                ⏳ Hali vaqti kelmagan
              </div>
            </div>
          </q-td>
        </template>

        <!-- ACTIONS -->
        <template #body-cell-actions="props">
          <q-td align="right">
            <q-btn flat round icon="edit" color="primary" @click="edit(props.row)" />
            <q-btn flat round icon="delete" color="negative" @click="removeGoal(props.row.id)" />
          </q-td>
        </template>

        <!-- EMPTY -->
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-6">
            Hozircha maqsad yo‘q. “Yangi maqsad” tugmasini bosing 🚀
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- MODAL -->
    <q-dialog v-model="dialog">
      <q-card class="dialog-card">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">
            {{ form.id ? 'Maqsadni tahrirlash' : 'Yangi maqsad' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.title" label="Maqsad nomi" outlined autofocus />
          <q-input v-model="form.description" label="Izoh" type="textarea" outlined />

          <q-select
            v-model="form.category"
            :options="['Study', 'Health', 'Business', 'Personal']"
            label="Kategoriya"
            outlined
          />

          <q-input v-model="form.dueDate" label="Oxirgi muddat" type="date" outlined />

          <q-toggle v-model="form.done" label="Bajarildi deb belgilash" color="positive" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Bekor qilish" v-close-popup />
          <q-btn color="primary" label="Saqlash" unelevated @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.table-card {
  border-radius: 18px;
}

.dialog-card {
  width: 100%;
  max-width: 420px;
  border-radius: 18px;
}

.done-text {
  text-decoration: line-through;
  color: #9ca3af;
}
</style>
