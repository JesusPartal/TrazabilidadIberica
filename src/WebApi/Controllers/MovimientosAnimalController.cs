using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.MovimientosAnimal.Commands;
using TrazabilidadIberica.Application.MovimientosAnimal.Queries;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MovimientosAnimalController : ControllerBase
{
    private readonly IMediator _mediator;
    public MovimientosAnimalController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? animalId, [FromQuery] Guid? fincaId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetMovimientosAnimalQuery(animalId, fincaId, page, pageSize));
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetMovimientoAnimalQuery(id));
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMovimientoAnimalCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMovimientoAnimalCommand command)
    {
        if (id != command.Id) return BadRequest("El id del path no coincide con el del body");
        try { await _mediator.Send(command); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _mediator.Send(new DeleteMovimientoAnimalCommand(id)); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
