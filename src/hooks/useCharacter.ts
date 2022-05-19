import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Character } from "../../types/RMCharacter";

enum ICharacterState {
      LOADING = 'LOADING',
      LOADED = 'LOADED',
      ERROR = 'ERROR',
}

// Custom hook for fetching RickMorty Character => Array
const useCharacter = () => {

      const [id, setId] = useState(Math.round(Math.random() * 826));
      const [character, setCharacter] = useState<Character | null>(null);
      const defStates = {
            LOADING: 'LOADING',
            LOADED: 'LOADED',
            ERROR: 'ERROR',
      };
      const [characterState, setCharacterState] = useState<ICharacterState>(ICharacterState.LOADING);

      const changeCharacter = () => {

            setId(Math.round(Math.random() * 826))

      }

      useEffect(() => {

            const endPoint = `https://rickandmortyapi.com/api/character/${id}`;

            console.log(`random character: ${id}`)

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

      }, [id])

      return { character, characterState, changeCharacter, defStates };
}

export default useCharacter;