using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.Veterinarios.Commands;
using TrazabilidadIberica.Application.Veterinarios.Queries;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VeterinariosController : ControllerBase
{
    private readonly IMediator _mediator;
    public VeterinariosController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetVeterinariosQuery(page, pageSize));
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetVeterinarioQuery(id));
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVeterinarioCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVeterinarioCommand command)
    {
        if (id != command.Id) return BadRequest("El id del path no coincide con el del body");
        try { await _mediator.Send(command); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _mediator.Send(new DeleteVeterinarioCommand(id)); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
