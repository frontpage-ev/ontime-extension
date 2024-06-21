<script setup lang="ts">
import { Ref, ref } from 'vue'
import { useContext } from './composables/useContext.ts'
import { useInitial } from './composables/useInitial.ts'
import axios from 'axios'

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface Timer {
  name: string;
  speaker: string;
  start_time: Date;
  end_time: Date|null;
  notes: string;
}

// time is in seconds from midnight
interface EventData {
  title: string
  subtitle: string
  presenter: string
  note: string
  timerType: string
  timeStart: number
  timeEnd: number
  isPublic: boolean
  user0: string
}

const selected = ref<DayOfWeek | null>(null)
const schedule = ref<{
  [key in DayOfWeek]: Timer[]
}>({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
})

const getTimers = async () => {
  const {data: {rundown}} = await axios.get('https://ontime.chrotos.net/events/cached')

  rundown.forEach((event: EventData) => {
    if (!event.isPublic) return
    if (event.title.includes('Break')) return
    if (event.title.includes('Pause')) return
    const day = event.user0.toLowerCase() as DayOfWeek

    if (!schedule.value[day]) {
      schedule.value[day] = []
    }

    schedule.value[day].push({
      name: event.title,
      speaker: event.presenter,
      start_time: new Date(event.timeStart),
      end_time: event.timeEnd ? new Date(event.timeEnd) : null,
      notes: event.note,
    })
  })

  // sort data.data by start_time
  const keys = Object.keys(schedule.value) as DayOfWeek[]
  keys.forEach(key => {
    schedule.value[key].sort((a, b) => {
      if (a.start_time && b.start_time) {
        return a.start_time.getTime() - b.start_time.getTime()
      }
      return 0
    })
  })

  console.log({schedule: schedule.value})
}

const date = (timer: Timer, last: boolean) => {
  if (timer.start_time && (!last || !timer.end_time)) {
    // HH:MM
    return timer.start_time.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
  }

  if (timer.end_time) {
    return timer.end_time.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
  }

  return 'TBA'
}

const values: Ref<{
  days: {
    [key in DayOfWeek]: boolean
  },
  color: string,
  server: string,
  'day-of-week': DayOfWeek,
} | null> = ref(null)

useContext((context, changed) => {
  if (changed.includes('values')) {
    values.value = context['values']
  }
})

const handler = () => {
  const days = (Object.keys(schedule.value) as DayOfWeek[])
      .filter(day => schedule.value[day].length > 0)

  if (selected.value === null) {
    selected.value = days[0]
    return
  }

  const index = days.indexOf(selected.value)
  selected.value = days[(index + 1) % days.length]
}

useInitial(schedule, async () => {
  await getTimers()
  handler()
  setInterval(handler, 5000)
})
</script>

<template>
  <div
      v-if="selected"
      class="flex justify-between flex-col h-full"
  >
    <div>
      <div class="text-5xl uppercase font-bold pb-8">
        {{ selected }}
      </div>
      <transition-group name="fade" mode="out-in">
        <div class="grid grid-cols-3 gap-8" :key="selected">
          <template
              v-for="(timer, i) in schedule[selected]"
              :key="i"
              v-if="schedule[selected]"
          >
            <transition
                appear
                enter-active-class="wave-enter-active"
                leave-active-class="wave-leave-active"
                name="wave"
            >
              <div class="bg-ice text-black rounded-xl p-4" :style="{ 'transition-delay': `${i * 0.05}s` }">
                <div class="flex justify-between gap-4">
                  <div class="text-xl">
                    <div class="text-4xl">{{ timer.name }}</div>
                    <div class="text-black/50 text-2xl ">{{ timer.speaker }}</div>
                  </div>
                  <div class="text-4xl text-right">
                    <div>{{ date(timer, i >= schedule[selected].length - 1) }}</div>
                    <div class="text-black/30">CEST</div>
                  </div>
                </div>
              </div>
            </transition>
          </template>
        </div>
      </transition-group>
    </div>
  </div>
</template>
