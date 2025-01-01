import { defineStore } from "pinia";
import { computed, ref } from "vue";

const initTab = ref('gosiwon');

export const useRoomStore = defineStore('room', () => {
    const roomTab = computed(() => initTab);

    const changeRoomTab = (type) => {
        initTab.value = type;
    }

    return { roomTab, changeRoomTab };
})