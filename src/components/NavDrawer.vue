<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :permanent="!isMobile"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
  >
    <v-list nav>
      <v-list-item
        v-for="item in visibleMenu"
        :key="item.link"
        :to="{ name: item.link }"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from "vue";

import { useStore } from "@/store";
import { sellerMenuItems, systemMenuItems } from "@/utils/menu";
import { useAccess } from "@/utils/access";

const props = defineProps({
  modelValue: Boolean,
  isMobile: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const { filterMenuItemsByAccess } = useAccess();

const drawerModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const menuItems = computed(() => {
  const role_id = store.getAuth?.user?.role_id;

  if (role_id === 5) {
    return sellerMenuItems;
  }

  return systemMenuItems;
});

const visibleMenu = computed(() => filterMenuItemsByAccess(menuItems.value));
</script>
