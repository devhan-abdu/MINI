import { useState, useEffect } from "react";

export const useFetchQuran = () => {
    const [items, setItems] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    useEffect(()=> {

    const fetchQuran = async () => {
         try {
            setLoading(true)
           const response = await fetch("https://api.quranhub.com/v1/surah/?revelationOrder=false", {
  method: "GET"
})
      const data = await response.json()

      if(data.code === 200 && data.data) {
        setItems(data.data)
      } else {
        setError("failed to fetch data")
      }
      setItems(data.data)

         } catch (error) {
              setError(String(error) || "Something went wrong")
         }finally {
             setLoading(false)
         }
    }

    fetchQuran();
    }, [])


    return { items , loading , error}
}