// src/app/(protected)/transfers/actions.ts
"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Acción del servidor para guardar un traslado de inventario. Esta función
 * recibe los datos del formulario en formato FormData, ajusta las
 * cantidades de los lotes de origen y destino y registra los movimientos
 * correspondientes en la tabla movimientos_inventario. Si ocurre algún
 * error, hace rollback de la transacción y devuelve un mensaje adecuado.
 */
export async function saveTransfer(prevState: any, formData: FormData) {
  const transferType = formData.get('transferType') as string | null;
  const quantityStr = formData.get('quantity') as string | null;
  const originLotStr = formData.get('originLot') as string | null;
  const destinationLotStr = formData.get('destinationLot') as string | null;
  const productStr = formData.get('product') as string | null;

  const quantity = quantityStr ? Number(quantityStr) : 0;
  const originLotId = originLotStr ? Number(originLotStr) : NaN;
  const destinationLotId = destinationLotStr ? Number(destinationLotStr) : NaN;
  const productId = productStr ? Number(productStr) : NaN;

  if (!quantity || isNaN(originLotId) || isNaN(destinationLotId) || isNaN(productId)) {
    return { success: false, message: 'Datos inválidos para el traslado.' };
  }

  let db;
  try {
    db = await pool.getConnection();
    await db.beginTransaction();
    // Reducir la cantidad en el lote de origen
    await db.query('UPDATE lotes SET cantidad = cantidad - ? WHERE id = ?', [quantity, originLotId]);
    // Aumentar la cantidad en el lote de destino
    await db.query('UPDATE lotes SET cantidad = cantidad + ? WHERE id = ?', [quantity, destinationLotId]);
    // Registrar movimientos de salida y entrada en inventario. Tomamos almacen_id de cada lote.
    // Salida
    await db.query(
      `INSERT INTO movimientos_inventario (fecha, tipo, referencia, producto_id, lote_id, almacen_id, cantidad, costo_unit) 
       SELECT NOW(), 'TRASLADO_SALIDA', 'Traslado', ?, id, almacen_id, ?, 0 
       FROM lotes WHERE id = ?`,
      [productId, quantity, originLotId]
    );
    // Entrada
    await db.query(
      `INSERT INTO movimientos_inventario (fecha, tipo, referencia, producto_id, lote_id, almacen_id, cantidad, costo_unit) 
       SELECT NOW(), 'TRASLADO_ENTRADA', 'Traslado', ?, id, almacen_id, ?, 0 
       FROM lotes WHERE id = ?`,
      [productId, quantity, destinationLotId]
    );
    await db.commit();
    // Revalidamos la página para que se actualicen los datos
    revalidatePath('/transfers');
    return { success: true, message: 'Traslado registrado con éxito.' };
  } catch (error: any) {
    if (db) await db.rollback();
    console.error('Error al registrar traslado:', error);
    return { success: false, message: 'Error al registrar el traslado.' };
  } finally {
    if (db) db.release();
  }
}