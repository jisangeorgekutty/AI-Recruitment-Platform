using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities.Common;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LinqKit;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class GenericRepository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GenericRepository(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<T?> Get(long id)
        {
            return Task.FromResult(_dbContext.Set<T>().FirstOrDefault(x => !x.IsDeleted && x.Id == id));
        }

        public Task<IReadOnlyList<T>> GetAll()
        {
            if (typeof(T).IsSubclassOf(typeof(OrderableBaseEntity)))
                return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(x => !x.IsDeleted)
                    .OrderBy(x => (x as OrderableBaseEntity)!.DisplayOrder).ToList());

            return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(x => !x.IsDeleted).ToList());
        }

        public Task<IReadOnlyList<T>> Where(Expression<Func<T, bool>> predicate)
        {
            if (typeof(T).IsSubclassOf(typeof(OrderableBaseEntity)))
                return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(predicate.And(x => !x.IsDeleted))
                    .OrderBy(x => (x as OrderableBaseEntity)!.DisplayOrder).ToList());
            return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(predicate.And(x => !x.IsDeleted)).ToList());
        }

        public Task<long> Count()
        {
            return Task.FromResult<long>(_dbContext.Set<T>().Count(x => !x.IsDeleted));
        }

        public Task<T> First(Expression<Func<T, bool>>? predicate = null)
        {
            predicate = predicate?.And(x => !x.IsDeleted);
            return _dbContext.Set<T>().FirstAsync(predicate ?? (T => true));
        }

        public Task<T?> FirstOrDefault(Expression<Func<T, bool>>? predicate = null)
        {
            predicate = predicate?.And(x => !x.IsDeleted);
            return _dbContext.Set<T>().FirstOrDefaultAsync(predicate ?? (T => true));
        }


        public Task<T?> GetActive(long id)
        {
            return Task.FromResult(_dbContext.Set<T>().FirstOrDefault(x => !x.IsDeleted && x.Id == id && x.IsActive));
        }

        public Task<IReadOnlyList<T>> GetAllActive()
        {
            if (typeof(T).IsSubclassOf(typeof(OrderableBaseEntity)))
                return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(x => !x.IsDeleted && x.IsActive)
                    .OrderBy(x => (x as OrderableBaseEntity)!.DisplayOrder).ToList());

            return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>().Where(x => !x.IsDeleted && x.IsActive).ToList());
        }

        public Task<IReadOnlyList<T>> WhereActive(Expression<Func<T, bool>> predicate)
        {
            if (typeof(T).IsSubclassOf(typeof(OrderableBaseEntity)))
                return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>()
                    .Where(predicate.And(x => !x.IsDeleted && x.IsActive))
                    .OrderBy(x => (x as OrderableBaseEntity)!.DisplayOrder).ToList());
            return Task.FromResult<IReadOnlyList<T>>(_dbContext.Set<T>()
                .Where(predicate.And(x => !x.IsDeleted && x.IsActive)).ToList());
        }

        public Task<T> FirstActive(Expression<Func<T, bool>>? predicate = null)
        {
            predicate = predicate?.And(x => !x.IsDeleted && x.IsActive);
            return _dbContext.Set<T>().FirstAsync(predicate ?? (T => true));
        }

        public Task<T?> FirstOrDefaultActive(Expression<Func<T, bool>>? predicate = null)
        {
            predicate = predicate?.And(x => !x.IsDeleted && x.IsActive);
            return _dbContext.Set<T>().FirstOrDefaultAsync(predicate ?? (T => true));
        }


        public async Task<T> Add(T entity)
        {
            await _dbContext.AddAsync(entity);
            return entity;
        }

        public async Task AddRange(IEnumerable<T> entities)
        {
            await _dbContext.AddRangeAsync(entities);
        }

        public Task Update(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public Task UpdateRange(IEnumerable<T> entities)
        {
            _dbContext.UpdateRange(entities);
            return Task.CompletedTask;
        }

        public Task Remove(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            return Task.CompletedTask;
        }

        public Task RemoveRange(IEnumerable<T> entities)
        {
            _dbContext.RemoveRange(entities);
            return Task.CompletedTask;
        }

        public Task SoftDelete(T entity)
        {
            entity.IsDeleted = true;
            return Task.CompletedTask;
        }

        public async Task<int> SaveChanges()
        {
            var user = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            return user is null ? await _dbContext.SaveChangesAsync() : await _dbContext.SaveChangesAsync(user.Value);
        }
    }
}
