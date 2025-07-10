import { BsArrowCounterclockwise, BsArrowClockwise } from "react-icons/bs";


function UndoRedo() {


    return (
        <section className="undoRedo">
            <button className="undoRedoButtons"><BsArrowCounterclockwise /></button>
            <button className="undoRedoButtons"><BsArrowClockwise /></button>
        </section>
    )
}

export default UndoRedo