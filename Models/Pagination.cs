using System;
using System.Collections;
using System.Collections.Generic;

namespace RoomAid.Models {
    public class PaginationResult<T> where T : class {
        public IList<T> Documents {get; set;} = new List<T>();

        /// <summary>
        /// Limits the number of documents
        /// </summary>
        public long DisplayCount {get; set;} = 5;
        
        /// <summary>
        /// Number of pages used for DisplayCount
        /// </summary>
        public long PageCount {get; set;} = 0;

        /// <summary>
        /// Current viewable page
        public long PageIndex {get; set;} = 0;
    }
}