using OpenStoryForge.Extensions;

#pragma warning disable IDE0211 // 转换为 'Program.Main' 样式程序
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
#pragma warning restore IDE0211 // 转换为 'Program.Main' 样式程序

builder.Services.AddOpenStoryForgeServices(builder.Configuration);

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync().ConfigureAwait(false);
