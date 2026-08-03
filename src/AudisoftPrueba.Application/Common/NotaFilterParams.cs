using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudisoftPrueba.Application.Common
{
    public class NotaFilterParams : PaginationParams
    {
        public string? Nombre { get; set; }
        public decimal? Valor { get; set; } 
        public int? IdEstudiante { get; set; }
        public int? IdProfesor { get; set; }
    }
}
