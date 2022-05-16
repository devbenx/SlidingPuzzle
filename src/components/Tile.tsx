import { motion } from "framer-motion"
import { FC, ReactNode } from "react"
import styled from "styled-components"

// BOARD PIECE
interface ITile {
      readonly size: {
            width: number,
            height: number,
      },
      readonly gamesolved: number,
      readonly last: number,
      readonly imgurl: string,
      readonly tileprops: {
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

interface ISize {
      width: number,
      height: number
}

interface IGrid {
      rows: number,
      cols: number
}

const Tile: FC<{
      grid: IGrid,
      size: ISize,
      id: number,
      imgurl: string,
      last: boolean,
      handleClick: (index: number) => void,
      boardwidth: number,
      index: number,
      children: ReactNode,
      gameSolved: boolean,
}> = ({ size, id, imgurl, last, handleClick, boardwidth, index, children, grid, gameSolved }) => {

      const onClickHandler = () => {

            handleClick(index)

      }
      const tileProps = {
            imgPos: {
                  width: -(1 / grid.cols) * (id % grid.cols) * boardwidth,
                  height: -(1 / grid.rows) * Math.floor(id / (grid.cols)) * boardwidth
            },
            imgSize: {
                  width: boardwidth,
                  height: boardwidth
            },

      }

      return (
            <StyledTile
                  gamesolved={gameSolved ? 1 : 0}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  size={size}
                  key={id}
                  imgurl={imgurl}
                  tileprops={tileProps}
                  last={last ? 1 : 0}
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

      ${({ last }) => (last === 1) && `
            background: #3a4766;
      `}
`;

export default Tile;