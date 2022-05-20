import { FC, ReactNode } from "react";
import styled from 'styled-components';
import { motion } from "framer-motion"
import usePuzzle from "../hooks/usePuzzle";
import Tile from "./Tile";

const Puzzle: FC = () => {

      // usePuzzle Custom Hook => object props
      const puzzle = usePuzzle();

      const handleShuffle = () => puzzle.shuffle();

      const handleStartGame = () => puzzle.game.startGame();

      const handleRestartGame = () => puzzle.game.restartGame();

      const handleCharacterChange = () => puzzle.character.changeCharacter();

      const handleTileClick = (index: number) => puzzle.tile.onClick(index);

      return (
            <BoardContainer>

                  <Title>{puzzle.character.character?.name}</Title>

                  <Board ref={puzzle.container.ref} height={puzzle.container.size} gameSolved={puzzle.state.solved}>

                        {puzzle.character.characterState === puzzle.character.defStates.ERROR
                              && <h1>Ups Something Happened!</h1>}

                        {puzzle.character.characterState === puzzle.character.defStates.LOADING
                              && <h1>Loading...</h1>}

                        {puzzle.character.characterState === puzzle.character.defStates.LOADED
                              && puzzle.character.character
                              && puzzle.boardArray.map((tile, index) => {
                                    return <Tile
                                          puzzle={puzzle}
                                          id={tile}
                                          index={index}
                                          key={index.toString()}
                                          handleClick={handleTileClick}
                                    >
                                    </Tile>
                              })}
                        {!puzzle.state.started && puzzle.state.tileClicked ? <WinningDiv tileclicked={puzzle.state.tileClicked ? 1 : 0}>Click start</WinningDiv> : <></>}
                  </Board>

                  {puzzle.state.solved && puzzle.state.started && <WinningDiv>✨YOU WON! ✨</WinningDiv>}

                  <ButtonContainer>
                        {!puzzle.state.started && <>
                              <button onClick={() => handleStartGame()}>Start Game</button>
                              {puzzle.state.started ? <></> : <button onClick={() => handleCharacterChange()}>Change Image</button>}

                              {/* <StyledLabel htmlFor="rows">rows:</StyledLabel> */}
                              <StyledSelect id="rows" value={puzzle.grid.rows} onChange={event => puzzle.setGrid({ ...puzzle.grid, rows: Number(event.target.value) })} >
                                    <option value={3} key={'default'}>Rows</option>
                                    {[...Array.from(Array(12).keys()).filter((row) => row > 1)].map((index) => {
                                          return <option value={index} key={index.toString()}>{index}</option>

                                    })}
                              </StyledSelect>

                              {/* <StyledLabel htmlFor="cols">cols:</StyledLabel> */}
                              <StyledSelect id="cols" value={puzzle.grid.cols} onChange={event => puzzle.setGrid({ ...puzzle.grid, cols: Number(event.target.value) })} >
                                    <option value={3} key={'default'}>Cols</option>
                                    {[...Array.from(Array(12).keys()).filter((col) => col > 1)].map((index) => {
                                          return <option value={index} key={index.toString()}>{index}</option>

                                    })}
                              </StyledSelect>
                        </>}
                        {!puzzle.state.solved && puzzle.state.started && <>
                              <button onClick={() => handleShuffle()}>Shuffle again</button>
                              <button onClick={() => handleRestartGame()}>Restart game</button>
                              <button>{puzzle.state.moves}</button>
                        </>}
                        {puzzle.state.solved && puzzle.state.started && <button onClick={() => handleRestartGame()}>Play again</button>}
                  </ButtonContainer>

            </BoardContainer >
      )
}

export default Puzzle;

// styled-components

const StyledLabel = styled('label')`
      margin: 0;
      color:  #bee5fd;
      border-radius: 12px;
      font-weight: bold;
      text-transform: uppercase;    
`
const StyledSelect = styled('select')`
      padding: 1rem;
      margin: 0;
      color:  #bee5fd;
      background-color: #3a4786;
      border-radius: 12px;
      font-weight: bold;
      text-transform: uppercase;
      border: 2px solid #05b3c6;
      transition: all 0.4s;
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
      max-width: 600px;
      max-height: 600px;
      font-size: 1rem;
      text-align: center;
      background-color: #3a4766;
      color: #f674da;
      /* outline: 0.2rem solid ${props => props.gameSolved ? '#97cd4d' : '#f674da'}; */

`;

const Title = styled.h1`
      color: #bee5fd;
      line-height: 1.7;
      margin: 1.2rem auto;
`;

interface IWindiv {
      tileclicked?: number;
}

const WinningDiv = styled(motion.div) <IWindiv>`

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
      color: ${props => props.tileclicked === 1 ? '#f674da' : '#f674da'};
      border-radius: 1rem;
      text-transform: uppercase;

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
            border-radius: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border: 2px solid #97cd4d;
            transition: all 0.4s;
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