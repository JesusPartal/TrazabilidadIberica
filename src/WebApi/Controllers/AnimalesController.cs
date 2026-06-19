using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrazabilidadIberica.Application.Animals.Commands;
using TrazabilidadIberica.Application.Animals.Queries;

namespace TrazabilidadIberica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnimalesController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnimalesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var animales = await _mediator.Send(new GetAnimalsQuery());
        return Ok(animales);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var animal = await _mediator.Send(new GetAnimalQuery(id));

        if (animal is null)
            return NotFound();

        return Ok(animal);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAnimalCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAnimalCommand command)
    {
        if (id != command.Id)
            return BadRequest("El id del path no coincide con el del body");

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteAnimalCommand(id));
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
