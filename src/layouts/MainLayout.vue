<template>
  <q-layout view="hHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title class="text-weight-bold"> 🎯 Maqsadlar kundaligi </q-toolbar-title>

        <q-space />

        <q-avatar size="32px">
          <img src="https://i.pravatar.cc/100" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer v-model="drawer" show-if-above bordered :width="240">
      <!-- LOGO -->
      <div class="row items-center q-pa-md">
        <q-avatar size="42px" class="bg-primary text-white"> 🎯 </q-avatar>
        <div class="q-ml-sm">
          <div class="text-weight-bold">Maqsadlar kundaligi</div>
          <div class="text-grey-5 text-caption">Produktivlik ilovasi</div>
        </div>
      </div>

      <q-separator />

      <!-- MENU -->
      <q-list padding>
        <q-item
          v-for="link in links"
          :key="link.title"
          clickable
          v-ripple
          :to="link.to"
          active-class="menu-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" size="20px" />
          </q-item-section>

          <q-item-section class="text-weight-medium">
            {{ link.title }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- PAGE -->
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout',
});

interface Link {
  title: string;
  icon: string;
  to: string;
}

const drawer = ref(true);

const links: Link[] = [
  { title: 'Bosh sahifa', icon: 'dashboard', to: '/dashboard' },
  { title: 'Maqsadlar', icon: 'flag', to: '/goals' },
];
</script>

<style scoped>
.menu-item {
  border-radius: 12px;
  margin: 6px 10px;
  color: #374151;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}

.menu-active .q-icon {
  color: #4f46e5;
}
</style>
