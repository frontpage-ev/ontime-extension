export function useContext(_callback: (_context, _changed) => void) {
    // @ts-ignore
    OWN3D.ext.onContext((_context, _changed) => {
        _callback(_context, _changed)
    })

    const interval = setInterval(() => {
        // @ts-ignore
        if (OWN3D.ext.context) {
            clearInterval(interval)
            const keys = Object.keys(OWN3D.ext.context)
            _callback(OWN3D.ext.context, keys)
        }
    }, 100)
}