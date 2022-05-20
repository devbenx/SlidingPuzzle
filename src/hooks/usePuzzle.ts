import { useEffect, useState } from "react";
import useCharacter from "./useCharacter";
import useResize from "./useCompResize";
import useDebounce from "./useDebounce";

interface IGrid {
      rows: number;
      cols: number;
}

interface IGameState {
      started: boolean;
      solved: boolean;
      moves: number;
      tileClicked: boolean;
}

interface ITile {
      width: number,
      height: number,
}

// Custom hook for board => Array
export const usePuzzle = () => {

      // Integrating Rick & Morty API Character
      const character = useCharacter();

      // Game states
      const gameStateDefs: IGameState = {
            started: false,
            solved: false,
            moves: 0,
            tileClicked: false,
      }
      const [gameState, setGameState] = useState<IGameState>(gameStateDefs);

      const gridDefs: IGrid = {
            cols: 3,
            rows: 3
      }
      const [grid, setGrid] = useState<IGrid>(gridDefs);
      const [boardArray, setBoardArray] = useState<number[]>([...Array.from(Array(grid.rows * grid.cols).keys())]);

      useEffect(() => {

            setBoardArray([...Array.from(Array(grid.rows * grid.cols).keys())])

      }, [grid])

      useEffect(() => {

            if (gameState.started) {
                  setGameState({ ...gameState, solved: isSolved(boardArray) })
            }

      }, [boardArray])

      // Game Functionalities
      const restartGame = () => {

            setGameState({
                  started: false,
                  solved: false,
                  moves: 0,
                  tileClicked: false,
            });
            sort(boardArray)
            character.changeCharacter();
            console.log(`restarting...`)

      }

      const startGame = () => {

            setGameState({
                  started: true,
                  solved: false,
                  moves: 0,
                  tileClicked: false,
            });
            shuffle();

            console.log(`starting...`)

      }


      // Puzzle Logic
      const isSolved = (board: number[]) => {

            for (let i = 0, l = board.length; i < l; i++) {
                  if (board[i] !== i) {
                        return false;
                  }
            }
            return true;
      }

      const isSolvable = (board: number[]) => {

            let product = 1;

            for (let i = 1, l = board.length - 1; i <= l; i++) {
                  for (let j = i + 1, m = l + 1; j <= m; j++) {
                        product *= (board[i - 1] - board[j - 1]) / (i - j);
                  }
            }

            return Math.round(product) === 1;
      }

      const shuffle: () => any = () => {

            const temp = [...boardArray]

            for (let i = temp.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [temp[i], temp[j]] = [temp[j], temp[i]];
            }

            const isShuffable = isSolvable(temp) && !isSolved(temp);

            return isShuffable ? setBoardArray(temp) : shuffle();
      }

      // With props
      const matrixPosition = (index: number) => {

            const pos = {
                  row: Math.floor(index / grid.cols),
                  col: index % grid.cols,
            }

            // console.log(`pos_col: ${pos.col}, pos_row: ${pos.row}`)
            return pos
      }

      const beforeSwapCheck = (srcIndex: number, emptyTileIndex: number) => {
            const { row: clickedTileRow, col: clickedTileCol } = matrixPosition(srcIndex);
            const { row: emptyTileRow, col: emptyTileCol } = matrixPosition(emptyTileIndex);
            const shouldSwap = Math.abs(clickedTileRow - emptyTileRow) + Math.abs(clickedTileCol - emptyTileCol) === 1;
            console.log(`should swap: ${shouldSwap}, srcIndex: ${srcIndex}, destIndex: ${emptyTileIndex}`)
            // console.log(`should swap: ${shouldSwap}, srcIndex: ${srcIndex}, destIndex: ${emptyIndex}`)
            // console.log(`emptyTileRow: ${emptyTileRow}, emptyTileCol: ${emptyTileCol}`)
            // console.log(`clickedTileRow: ${clickedTileRow}, clickedTileCol: ${clickedTileCol}`)
            return shouldSwap; //T F
      }

      const swap = (tiles: number[], src: number, empty: number) => {
            const tilesTemp = [...tiles];
            [tilesTemp[src], tilesTemp[empty]] = [tilesTemp[empty], tilesTemp[src]];
            setGameState({ ...gameState, moves: gameState.moves + 1 });
            setGameState({ ...gameState, tileClicked: false })
            console.log({ gameState })
            return setBoardArray([...tilesTemp]);
      }

      const sort = (board: number[]) => {
            board.sort(function (a, b) {
                  return a - b;
            });
            return board
      }

      // Specials
      const swapTiles = (tileToSwap: number, emptyTile: number) => {

            console.log(`tileIndex:${tileToSwap} holeIndex: ${boardArray.indexOf(emptyTile)}`)

            if (beforeSwapCheck(tileToSwap, boardArray.indexOf(emptyTile))) {

                  swap(boardArray, tileToSwap, boardArray.indexOf(emptyTile));

            }
      }

      // Tiles 
      const tileSizeDefs: ITile = {
            width: 0,
            height: 0
      }
      const [tileSize, setTileSize] = useState(tileSizeDefs);

      const puzzleContainerRef = useResize()

      useDebounce(tileSize, 2000);

      useEffect(() => {

            if (puzzleContainerRef.ref.current) {

                  setTileSize({
                        width: Math.floor(puzzleContainerRef.size / grid.cols) - 0.1,
                        height: Math.floor(puzzleContainerRef.size / grid.rows) - 0.1,
                  })
            }
      }, [grid, puzzleContainerRef.size, puzzleContainerRef.ref]);

      const tileClick = (index: number) => {


            if (gameState.started) {
                  setGameState({ ...gameState, tileClicked: true })
                  swapTiles(index, boardArray.length - 1);
                  // console.log(`gameSolved: ${gameState.solved}`)
            } else {
                  setTimeout(() => setGameState({ ...gameState, tileClicked: true })
                        , 300)
                  setGameState({ ...gameState, tileClicked: false })
                  console.log(`start game to swap tiles`)
            }
            console.log({ gameState })
      }

      return {
            grid,
            setGrid,
            boardArray,
            isSolved,
            isSolvable,
            shuffle,
            get: {
                  matrixPosition,
            },
            do: {
                  swapTiles,
                  swap,
                  beforeSwapCheck,
                  sort
            },
            game: {
                  restartGame,
                  startGame,
            },
            state: gameState,
            character,
            container: puzzleContainerRef,
            tile: {
                  size: tileSize,
                  onClick: tileClick,
            }

      }
}

export default usePuzzle