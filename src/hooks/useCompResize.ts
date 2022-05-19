import { useEffect, useRef, useState } from 'react'

const useResize = () => {

      const [componentSize, setComponentSize] = useState(0);

      const componentRef = useRef<HTMLUListElement>(null)

      useEffect(() => {

            const handleResize = () => {
                  if (componentRef.current) {
                        setComponentSize(Math.floor(componentRef.current.clientWidth));
                  }
            }

            window.addEventListener('resize', handleResize)

            if (typeof window !== "undefined") {
                  handleResize();
            }

            return () => {
                  window.removeEventListener('resize', handleResize)
            }

      }, [componentSize]);

      return {
            size: componentSize,
            ref: componentRef,
      }

}

export default useResize