using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TrazabilidadIberica.Application.Common.Interfaces;
using TrazabilidadIberica.Infrastructure.Data;
using TrazabilidadIberica.Infrastructure.Data.Interceptors;
using TrazabilidadIberica.Infrastructure.Identity;

namespace TrazabilidadIberica.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<AuditableEntityInterceptor>();

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"))
            .AddInterceptors(sp.GetRequiredService<AuditableEntityInterceptor>()));

        services.AddScoped<IApplicationDbContext>(sp =>
            sp.GetRequiredService<ApplicationDbContext>());

        services.AddIdentityCore<IdentityUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddScoped<IIdentityService, IdentityService>();

        return services;
    }
}
