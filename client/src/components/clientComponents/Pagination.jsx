import React from "react";

const Pagination = ({ myPackagesPerPage, totalPackages, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPackages / myPackagesPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                        <a
                            onClick={() => paginate(number)}
                            href="#"
                            className="page-link"
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
            <h6>
                showing{" "}
                {totalPackages > myPackagesPerPage
                    ? myPackagesPerPage
                    : totalPackages}{" "}
                of {totalPackages}
            </h6>
        </nav>
    );
};

export default Pagination;
