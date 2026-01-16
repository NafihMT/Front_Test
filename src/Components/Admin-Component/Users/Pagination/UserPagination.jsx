import React from 'react';
import './UserPagination.css';

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }



  return (
    <nav>
      <ul className='pagination'>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;