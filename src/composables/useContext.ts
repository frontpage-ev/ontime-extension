export function useContext(_callback: (_context: any, _changed: any) => void) {
    // @ts-ignore
    OWN3D.ext.onContext((_context: any, _changed) => {
        _callback(_context, _changed)
    })

    const interval = setInterval(() => {
        // @ts-ignore
        if (OWN3D.ext.context) {
            clearInterval(interval)
            // @ts-ignore
            const keys = Object.keys(OWN3D.ext.context)
            // @ts-ignore
            _callback(OWN3D.ext.context, keys)
        }
    }, 100)
}