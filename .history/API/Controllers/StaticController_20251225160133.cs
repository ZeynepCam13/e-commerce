using System.Text.Json;
using API.Data;
using API.Dtos;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class StaticController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IWebHostEnvironment _env;
    public StaticController(DataContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

[HttpGet("stats")]
public async Task<IActionResult> GetStoreStats()
{
  
    var totalSales = await _context.Orders.SumAsync(o => o.SubTotal); 
    var totalOrders = await _context.Orders.CountAsync();

    var thirtyDaysAgo = DateTime.Now.AddDays(-30);
    var newCustomers = await _context.Orders
        .Where(o => o.OrderDate >= thirtyDaysAgo)
        .Select(o => o.CustomerId)
        .Distinct()
        .CountAsync();

    
    var salesTrend = await _context.Orders
        .Where(o => o.OrderDate >= thirtyDaysAgo)
        .GroupBy(o => o.OrderDate.Date)
        .Select(g => new { 
            date = g.Key.ToString("dd.MM"), 
            amount = g.Sum(x => x.SubTotal) 
        })
        .OrderBy(x => x.date)
        .ToListAsync();

   
  
var categoryStats = await _context.Orders
    .SelectMany(o => o.OrderItems) 
    .Include(oi => oi.Product)
    .ThenInclude(p => p.subSubCategory)
    .GroupBy(oi => oi.Product.subSubCategory.Name ?? "Belirtilmemiş")
    .Select(g => new { 
        name = g.Key, 
        value = g.Count() 
    })
    .ToListAsync();

    return Ok(new { 
        totalSales, 
        totalOrders, 
        newCustomers, 
        salesTrend, 
        categoryStats 
    });
}}