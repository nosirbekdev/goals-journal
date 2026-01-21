<template>
  <q-page padding class="bg-grey-1">
    <!-- Sarlavha -->
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">📊 Bosh sahifa</div>
        <div class="text-grey-7">Maqsadlaringiz umumiy holati</div>
      </div>
    </div>

    <!-- STATISTIKA KARTALARI -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Jami -->
      <div class="col-12 col-md-4">
        <q-card class="stat-card">
          <q-card-section class="row items-center q-gutter-md">
            <q-avatar color="primary" text-color="white" icon="flag" size="48px" />
            <div>
              <div class="text-grey-7">Jami maqsadlar</div>
              <div class="text-h5 text-weight-bold">{{ store.total }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bajarilgan -->
      <div class="col-12 col-md-4">
        <q-card class="stat-card">
          <q-card-section class="row items-center q-gutter-md">
            <q-avatar color="positive" text-color="white" icon="check_circle" size="48px" />
            <div>
              <div class="text-grey-7">Bajarilgan maqsadlar</div>
              <div class="text-h5 text-weight-bold">{{ store.doneCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Progress -->
      <div class="col-12 col-md-4">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-grey-7">Bajarilish darajasi</div>
              <div class="text-weight-bold">{{ percent }}%</div>
            </div>
            <q-linear-progress
              rounded
              size="14px"
              :value="progress"
              color="primary"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MOTIVATSIYA -->
    <q-card flat bordered class="motivation-card">
      <q-card-section class="row items-center q-gutter-md">
        <q-avatar color="deep-purple" text-color="white" icon="emoji_events" />
        <div>
          <div class="text-weight-bold">Diqqatni yo‘qotmang 🎯</div>
          <div class="text-grey-7">Har kuni kichik qadam — katta natijaning boshlanishi.</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DashboardPage',
});

import { computed, onMounted } from 'vue';
import { useGoalsStore } from 'src/stores/goals.store';

const store = useGoalsStore();

onMounted(() => {
  store.load();
});

const progress = computed<number>(() => (store.total ? store.doneCount / store.total : 0));

const percent = computed<number>(() =>
  store.total ? Math.round((store.doneCount / store.total) * 100) : 0,
);
</script>

<style scoped>
.stat-card {
  border-radius: 18px;
  transition: 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.motivation-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #eef2ff, #ffffff);
}
</style>
