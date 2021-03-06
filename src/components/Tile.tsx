import { motion } from "framer-motion"
import { FC, ReactNode } from "react"
import styled from "styled-components"

// BOARD PIECE
interface ITile {
      size: {
            width: number,
            height: number,
      },
      gamesolved: number,
      gamestarted: number,
      last: number,
      imgurl: string,
      tileprops: {
            imgSize: {
                  width: number,
                  height: number,
            }
            imgPos: {
                  width: number,
                  height: number,
            }
      }
}

const Tile: FC<{
      puzzle: any,
      id: number,
      handleClick: (index: number) => void,
      index: number,
      children: ReactNode,
}> =
      ({ puzzle, id, handleClick, index, children }) => {

            const isLast = (id === (puzzle.boardArray.length - 1)) ? true : false;

            const onClickHandler = () => {

                  if (!isLast) {
                        handleClick(index)
                  }
                  console.log({ id }, { index })
            }

            const tileProps = {

                  imgPos: {
                        width: -(1 / puzzle.grid.cols) * (id % puzzle.grid.cols) * puzzle.container.size,
                        height: -(1 / puzzle.grid.rows) * Math.floor(id / (puzzle.grid.cols)) * puzzle.container.size
                  },
                  imgSize: {
                        width: puzzle.container.size,
                        height: puzzle.container.size,
                  },
            }

            return (
                  <StyledTile
                        gamesolved={puzzle.state.solved ? 1 : 0}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        size={puzzle.tile.size}
                        imgurl={puzzle.character.character.image}
                        tileprops={tileProps}
                        gamestarted={puzzle.state.started ? 1 : 0}
                        last={isLast ? 1 : 0}
                        onClick={() => onClickHandler()}
                        layout
                  >
                        {children}
                  </StyledTile>
            )

      }

const StyledTile = styled(motion.li) <ITile>`
      display: grid;
      width: ${props => props.size.width}px;
      height: ${props => props.size.height}px;
      font-size: 3rem;
      text-align: center;
      background-color: transparent;
      background-image: url(${props => props.imgurl});
      background-size: ${props => props.tileprops.imgSize.width}px ${props => props.tileprops.imgSize.height}px;
      background-repeat: no-repeat;
      background-position-x: ${props => props.tileprops.imgPos.width}px;
      background-position-y: ${props => props.tileprops.imgPos.height}px;
      align-items: center;
      justify-content: center;
      outline: 0.2rem solid ${props => props.gamesolved === 1 ? '#97cd4d' : '#f674da'};
      z-index: 0;
      /* transition: all 0.4s; ON HOVER ISSUES WITH FRAMER MOTION */ 

      ${({ last, gamestarted, gamesolved }) => (last === 1) && (gamestarted === 1) && `
            background: #3a4766;
            &:hover{
                  outline:  ${(last === 1 && gamestarted === 1) ? `0.2rem solid ${gamesolved === 1 ? '#97cd4d' : '#f674da'}` : '0.2rem solid #f674da'};
                  z-index:  ${(last === 1 && gamestarted === 1) ? 'unset' : 100};
            }
      `}

      &:hover{
            outline:  ${props => (props.gamestarted === 1 && props.last !== 1) ? `0.3rem solid ${props.gamesolved === 1 ? '#97cd4d' : '#bee5fd'}` : '0.2rem solid #f674da'};
            z-index:  ${props => (props.gamestarted === 1 && props.last !== 1) ? 100 : 0};
      }
`;

export default Tile;