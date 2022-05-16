import { Children, Component, FC, HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import React from 'react'
import styled from 'styled-components';
import axios, { AxiosError } from "axios";
import { Character } from '../../types/RMCharacter'
import { motion } from "framer-motion"
import { usePuzzleBoard } from "../hooks/usePuzzleBoard";
import Tile from "./Tile";


interface IGrid {
      rows: number,
      cols: number
}

enum ICharacterState {
      LOADING = 'LOADING',
      LOADED = 'LOADED',
      ERROR = 'ERROR',
}

const Puzzle: FC<{ grid: IGrid }> = ({ grid }) => {

      // Game logic
      const [gameStarted, setGameStarted] = useState(false);
      const [gameSolved, setGameSolved] = useState(false);

      const board = usePuzzleBoard(grid.rows, grid.cols);

      // Getting the image from Rick & Morty API
      const [character, setCharacter] = useState<Character | null>(null);
      const [characterId, setCharacterId] = useState(Math.round(Math.random() * 826));
      const [characterState, setCharacterState] = useState<ICharacterState>(ICharacterState.LOADING);

      const handleShuffle = () => {

            board.shuffle(board.boardArray);
            setGameStarted(true);

      }

      const handleRestartGame = () => {

            setCharacterId(Math.round(Math.random() * 826))
            setGameStarted(false);
            board.do.sort(board.boardArray)

      }

      const handleCharacterChange = () => {

            setCharacterId(Math.round(Math.random() * 826))

      }

      const handleTileClick = (index: number) => {

            board.do.swapTiles(index, board.boardArray.length - 1);
            console.log(`gameSolved: ${gameSolved}`)

      }

      // Board Component
      const [boardSize, setBoardSize] = useState(0);
      const [tileSize, setTileSize] = useState({ width: 0, height: 0 });
      const boardRef = useRef<HTMLUListElement>(null)

      useEffect(() => {

            const handleResize = () => {
                  if (boardRef.current) {
                        setBoardSize(Math.floor(boardRef.current.clientWidth));
                        setTileSize({
                              width: Math.floor(boardSize / grid.cols) - 0.1,
                              height: Math.floor(boardSize / grid.rows) - 0.1,
                        })
                        console.log(`hookRef width: ${boardRef.current.clientWidth}`);
                  }
            }

            window.addEventListener('resize', handleResize)

            if (typeof window !== "undefined") {
                  handleResize();
            }

            return () => {
                  window.removeEventListener('resize', handleResize)
            }

      }, [boardSize]);

      useEffect(() => {

            console.log(`random character: ${characterId}`)

            const endPoint = `https://rickandmortyapi.com/api/character/${characterId}`;

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
      }, [characterId])

      useEffect(() => {

            if (gameStarted) {
                  setGameSolved(board.isSolved(board.boardArray))
            }


      }, [board])



      return (
            <BoardContainer>

                  <Title>{character?.name}</Title>

                  <Board ref={boardRef} height={boardSize} gameSolved={gameSolved}>
                        {characterState === ICharacterState.ERROR && <h1>Ups Something Happened!</h1>}
                        {characterState === ICharacterState.LOADING && <h1>Loading...</h1>}
                        {characterState === ICharacterState.LOADED && character && board.boardArray.map((tile, index) => {
                              return <Tile
                                    size={{ width: tileSize.width, height: tileSize.height }}
                                    id={tile}
                                    imgurl={character!.image}
                                    boardwidth={boardSize}
                                    grid={grid}
                                    last={(tile === (board.boardArray.length - 1) ? true : false)}
                                    index={index}
                                    gameSolved={gameSolved}
                                    handleClick={handleTileClick}
                                    key={index}
                              >
                              </Tile>
                        })}
                  </Board>

                  {gameSolved && gameStarted && <WinningDiv>✨YOU WON! ✨</WinningDiv>}

                  <ButtonContainer>
                        {!gameStarted && <button onClick={() => handleShuffle()}>Start Game</button>}
                        {!gameSolved && gameStarted && <button onClick={() => handleRestartGame()}>Restart game</button>}
                        {gameStarted ? <></> : <button onClick={() => handleCharacterChange()}>Change Image</button>}
                        {gameSolved && gameStarted && <button onClick={() => handleRestartGame()}>Play again</button>}
                  </ButtonContainer>

            </BoardContainer >
      )
}

export default Puzzle;

// styled-components

const BoardContainer: FC<{ children: ReactNode }> = ({ children }) => {
      return (
            <StyledBoardContainer>{children}</StyledBoardContainer>
      )
}

// BOARD
interface IBoard {
      height: number,
      gameSolved: boolean,
}

const Board = styled('ul') <IBoard>`

      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-self: center;

      list-style: none;
      padding: 0;
      margin: auto;
      height: ${props => props.height}px;
      width: 100%;
      max-width: 650px;
      max-height: 650px;
      font-size: 1rem;
      text-align: center;
      background-color: #97cd4d;
      outline: 0.2rem solid ${props => props.gameSolved ? '#97cd4d' : '#f674da'};

`;

const Title = styled.h1`
      color: #bee5fd;
`;


const WinningDiv = styled(motion.div)`

      position: absolute;
      width: auto;
      height: auto;
      padding: 2rem;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10vmin;
      font-weight: bold;
      background-color: #bee5fd;
      color: #f674da;
      border-radius: 1rem;

`;

const ButtonContainer = styled('div')`

      width: 100%;
      height: auto;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
      gap: 1rem;
      >button{
            padding: 1rem;
            color:  #bee5fd;
            background-color: #3a4786;
            border-radius: 5px;
            font-weight: bold;
            text-transform: uppercase;
            border: 2px solid #97cd4d;
            &:hover{
                  border: 2px solid #f674da;
            }
      }

`;

// BOARD CONTAINER
const StyledBoardContainer = styled('div')`

      width: 96vw;
      height: 96vh;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 2vh auto;

`;

// #97cd4d
// #3a4766
// #f674da
// #bee5fd
// #05b3c6
// #fff873
// #e54358