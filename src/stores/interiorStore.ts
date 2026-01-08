import { defineStore } from 'pinia';

export type SeatTone = 'Leather' | 'Alcantara';
export type ScreenColor = 'Blue' | 'Red' | 'White' | 'Green';

export const useInteriorStore = defineStore('interiorStore', {
    state: () => ({
        seatTone: 'Leather' as SeatTone,
        screenColor: 'Blue' as ScreenColor,
    }),

    actions: {
        setSeatTone(v: SeatTone) {
            this.seatTone = v;
        },
        setScreenColor(v: ScreenColor) {
            this.screenColor = v;
        },
    },
});
