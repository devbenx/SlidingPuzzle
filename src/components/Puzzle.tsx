import { Children, Component, FC, HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import React from 'react'
import styled from 'styled-components';
import axios, { AxiosError } from "axios";
import { Character } from '../../types/RMCharacter'
import { motion } from "framer-motion"
import { usePuzzleBoard } from "../hooks/usePuzzleBoard";
import Tile from "./Tile";
import { useCharacter } from "../hooks/useCharacter";


interface IGrid {
      rows: number,
      cols: number
}

enum ICharacterState {
      LOADING = 'LOADING',
      LOADED = 'LOADED',
      ERROR = 'ERROR',
}

const Puzzle: FC = () => {

      // Game logic
      const [gameStarted, setGameStarted] = useState(false);
      const [gameSolved, setGameSolved] = useState(false);
      const [moves, setMoves] = useState(0);

      const board = usePuzzleBoard();

      // Getting the image from Rick & Morty API
      const character = useCharacter();
      // const [character, setCharacter] = useState<Character | null>(null);
      const [characterId, setCharacterId] = useState(Math.round(Math.random() * 826));
      // const [characterState, setCharacterState] = useState<ICharacterState>(ICharacterState.LOADING);

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

            character.changeCharacter();

      }

      const handleTileClick = (index: number) => {
            if (gameStarted) {
                  setMoves(prev => prev + 1);
                  board.do.swapTiles(index, board.boardArray.length - 1);
                  console.log(`gameSolved: ${gameSolved}`)
            }
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
                              width: Math.floor(boardSize / board.grid.cols) - 0.1,
                              height: Math.floor(boardSize / board.grid.rows) - 0.1,
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

      }, [boardSize, board.grid]);


      useEffect(() => {

            if (gameStarted) {
                  setGameSolved(board.isSolved(board.boardArray))
            }

      }, [board])



      return (
            <BoardContainer>

                  <Title>{character.character?.name}</Title>

                  <Board ref={boardRef} height={boardSize} gameSolved={gameSolved}>
                        {character.characterState === ICharacterState.ERROR && <h1>Ups Something Happened!</h1>}
                        {character.characterState === ICharacterState.LOADING && <h1>Loading...</h1>}
                        {character.characterState === ICharacterState.LOADED && character.character && board.boardArray.map((tile, index) => {
                              return <Tile
                                    size={{ width: tileSize.width, height: tileSize.height }}
                                    id={tile}
                                    imgurl={character.character!.image}
                                    boardwidth={boardSize}
                                    grid={board.grid}
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
                        {!gameStarted && <>
                              <button onClick={() => handleShuffle()}>Start Game</button>
                              {gameStarted ? <></> : <button onClick={() => handleCharacterChange()}>Change Image</button>}

                              <StyledLabel htmlFor="rows">rows:</StyledLabel>
                              <StyledSelect id="rows" onChange={event => board.setGrid({ ...board.grid, rows: Number(event.target.value) })} >
                                    {[...Array.from(Array(12).keys()).filter((row) => row > 1)].map((index) => {
                                          return <option value={index} key={index}>{index}</option>

                                    })}
                              </StyledSelect>

                              <StyledLabel htmlFor="cols">cols:</StyledLabel>
                              <StyledSelect id="cols" onChange={event => board.setGrid({ ...board.grid, cols: Number(event.target.value) })} >
                                    {[...Array.from(Array(12).keys()).filter((col) => col > 1)].map((index) => {
                                          return <option value={index} key={index}>{index}</option>

                                    })}
                              </StyledSelect>
                        </>}
                        {!gameSolved && gameStarted && <>
                              <button onClick={() => handleRestartGame()}>Restart game</button>
                              <button>{moves}</button>
                        </>}
                        {gameSolved && gameStarted && <button onClick={() => handleRestartGame()}>Play again</button>}
                  </ButtonContainer>

            </BoardContainer >
      )
}

export default Puzzle;

// styled-components

const StyledLabel = styled('label')`
      margin: 0;
      color:  #bee5fd;
      border-radius: 5px;
      font-weight: bold;
      text-transform: uppercase;    
`
const StyledSelect = styled('select')`
      padding: 1rem;
      margin: 0;
      color:  #bee5fd;
      background-color: #3a4786;
      border-radius: 5px;
      font-weight: bold;
      text-transform: uppercase;
      border: 2px solid #97cd4d;
      &:hover{
            border: 2px solid #f674da;   
      }       
`

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
      margin: 0;
      height: ${props => props.height}px;
      width: 100%;
      max-width: 625px;
      max-height: 625px;
      font-size: 1rem;
      text-align: center;
      background-color: #97cd4d;
      outline: 0.2rem solid ${props => props.gameSolved ? '#97cd4d' : '#f674da'};

`;

const Title = styled.h1`
      color: #bee5fd;
      line-height: 1.7;
      margin: auto;
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
      @media (max-width: 500px) {
            flex-direction: column;
      }
`;

// BOARD CONTAINER
const StyledBoardContainer = styled('div')`

      min-height: 100vh;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: auto;
      padding: 0 0.7rem;

`;

// #97cd4d
// #3a4766
// #f674da
// #bee5fd
// #05b3c6
// #fff873
// #e54358