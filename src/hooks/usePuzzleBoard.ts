import { useEffect, useState } from "react";

// Custom hook for board => Array
export const usePuzzleBoard = () => {

      const [grid, setGrid] = useState({ cols: 3, rows: 3 });
      const [boardArray, setBoardArray] = useState<number[]>([...Array.from(Array(grid.rows * grid.cols).keys())]);

      useEffect(() => {

            setBoardArray([...Array.from(Array(grid.rows * grid.cols).keys())])

      }, [grid])


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

      const shuffle: (board: number[]) => any = (board: number[]) => { //Check

            for (let i = board.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [board[i], board[j]] = [board[j], board[i]];
            }
            // const shuffledBoardArray = [...board.sort(() => Math.random() - 0.5)];
            // .filter((t) => t !== board.length - 1)
            // board.length - 1,
            const res = isSolvable(board) && !isSolved(board) ? setBoardArray(board) : shuffle(board);

            return res;

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
      }
}
