import { Ref, ref, watch } from 'vue'

export function useInitial(_ref: Ref, handler: () => void) {
    const initial = ref(false)
    watch(_ref, () => {
        if (!initial.value) handler()
        initial.value = true
    })
    handler()
}