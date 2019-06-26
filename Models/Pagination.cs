using System;
using System.Collections;
using System.Collections.Generic;

namespace RoomAid.Models {
    public class PaginationResult<T> where T : class {
        public IList<T> Documents {get; set;}

        public long PageCount {get; set;}

        public long PageIndex {get; set;}
    }
}