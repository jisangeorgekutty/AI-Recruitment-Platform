using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<T?> Get(long id);
        Task<IReadOnlyList<T>> GetAll();
        Task<IReadOnlyList<T>> Where(Expression<Func<T, bool>> predicate);
        Task<T> First(Expression<Func<T, bool>>? predicate = null);
        Task<T?> FirstOrDefault(Expression<Func<T, bool>>? predicate = null);

        Task<T?> GetActive(long id);
        Task<IReadOnlyList<T>> GetAllActive();
        Task<IReadOnlyList<T>> WhereActive(Expression<Func<T, bool>> predicate);
        Task<T> FirstActive(Expression<Func<T, bool>>? predicate = null);
        Task<T?> FirstOrDefaultActive(Expression<Func<T, bool>>? predicate = null);

        Task<long> Count();
        Task<T> Add(T entity);
        Task AddRange(IEnumerable<T> entities);
        Task Update(T entity);
        Task UpdateRange(IEnumerable<T> entities);

        Task Remove(T entity);
        Task RemoveRange(IEnumerable<T> entities);

        Task SoftDelete(T entity);

        Task<int> SaveChanges();
    }
}
