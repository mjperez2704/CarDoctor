INSERT INTO ordenes_servicio (
    id,
    folio,
    fecha,
    cliente_id,
    equipo_id,
    diagnostico_ini,
    estado,
    tecnico_id,
    vehiculo_id
  )
VALUES (
    id:int,
    'folio:varchar',
    'fecha:datetime',
    cliente_id:int,
    equipo_id:int,
    'diagnostico_ini:text',
    'estado:enum',
    tecnico_id:int,
    vehiculo_id:int
  );