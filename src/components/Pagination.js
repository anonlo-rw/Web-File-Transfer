import LeftArrow from "../images/left.png";
import RightArrow from "../images/right.png";

const Pagination = ({ paginate }) => {
    return (
        <nav>
            <ul className="pagination">
                <a className="page-link" id="paginate" onClick={() => paginate("left")}>
                    <img src={LeftArrow} alt="leftarrow"/>
                </a>
                <a className="page-link" id="paginate" onClick={() => paginate("right")}>
                    <img src={RightArrow} alt="rightarrow"/>
                </a>
            </ul>
        </nav>
    );
}
export default Pagination;