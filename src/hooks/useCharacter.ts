import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Character } from "../../types/RMCharacter";

enum ICharacterState {
      LOADING = 'LOADING',
      LOADED = 'LOADED',
      ERROR = 'ERROR',
}

// Custom hook for fetching RickMorty Character => Array
export const useCharacter = (id: number) => {

      const [character, setCharacter] = useState<Character | null>(null);
      const [characterState, setCharacterState] = useState<ICharacterState>(ICharacterState.LOADING);

      // useEffect(() => {

      // }, [])
      // const randomCharacter = Math.round(Math.random() * 100);

      console.log(`random character: ${id}`)

      const endPoint = `https://rickandmortyapi.com/api/character/${id}`;

      const getData = async () => {

            // console.log('Getting data from API');

            const res = await axios.get<Character>(endPoint)
                  .then(function (response) {
                        // handle succes
                        setCharacter(response.data)
                        setCharacterState(ICharacterState.LOADED)
                        return response.data
                  })
                  .catch(function (error: Error | AxiosError) {
                        // handle error
                        setCharacterState(ICharacterState.ERROR)
                        if (error) return console.log(error);
                  })

            return res
      }

      getData();

      return { character, characterState };
}
