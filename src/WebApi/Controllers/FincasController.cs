using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.Fincas.Commands;
using TrazabilidadIberica.Application.Fincas.Queries;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FincasController : ControllerBase
{
    private readonly IMediator _mediator;

    public FincasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? ganaderoId)
    {
        var fincas = await _mediator.Send(new GetFincasQuery(ganaderoId));
        return Ok(fincas);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var finca = await _mediator.Send(new GetFincaQuery(id));

        if (finca is null)
            return NotFound();

        return Ok(finca);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFincaCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }
}
