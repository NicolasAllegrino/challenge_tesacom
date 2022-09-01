# Codificación y Decodificación de datos en Buffer de NodeJS
Librería para codificar y decodificar datos en función del formato definido por:
* ObjetoDatos <- Formato -> Trama binaria

## Referencias
### ObjetoDatos
Es el objeto que contiene los campos de datos que deben ser codificado/decodificado. Dichos campos pueden ser de los tipos que se muestran a continuación:
> uint -> entero sin signo, longitud variable (1 a 32bits) <br>
> int -> entero con signo, longitud variable (complemento a 2, 2 a 32bits)<br>
> float -> punto flotante de precisión simple (IEEE 754, 32bits)<br>

> ascii -> ASCII string terminada en #0 | 7bits x caracter (disponible en versión 1.1.0)<br>

A futuro se ampliará para datos:
> trama binaria ejemplo: 0x010203

### Formato
Es un array o vector de objetos, donde cada elemento corresponde a la definición de cada campo del objeto (ObjetoDatos) que se pretende codificar/decodificar.
Formato del Vector objeto:
* [ { tag: "?", type: "?", len: ? } ]

> tag -> Nombre del campo en el objeto para de/serializar <br>
> type -> Tipo de dato del campo <br>
> len -> Longitud en bits del campo (si aplica al tipo) <br>

### Trama binaria
Es un Buffer de Node.js que contiene los datos codificados de manera tal de optimizar la cantidad de bytes utilizados.

## Codificación
La codificación del ObjetoDatos con Formato a una Trama binaria se realiza con el método
*encode(_object, format)
> _object -> ObjetoDatos a codificar <br>
> format -> Formato de codificación <br>

Este método devuelve un objeto con formato:
* { size, buffer }
> size -> Tamaño de bytes del Buffer<br>
> buffer -> Buffer con datos codificados<br>

## Decodificación
La decodificación de la Trama binaria con Formato a un ObjetoDatos se realiza con el método
* decode(buffer, format)
> buffer -> Buffer a decodificar <br>
> format -> Formato de decodificación <br>

Este método devuelve un objeto con formato:
* { 'tag': value }
> 'tag' -> Va a corresponder al nombre determinado por el Format <br>
> value -> Valor del tag correspondiente decodificado del Buffer <br>

## IMPORTANTE
Para garantizar una correcta codificación/decodificación, cuyos datos contienen campos ASCII,
se recomienda tener como primer dato un ASCII y luego los demás.

## Cambios de versiones
### Versión 1.1.0
* Se agrega codificación y decodificación para datos ASCII
* Se resuelve codificación y decodificación para datos int positivos

### Versión 1.1.0
* Se resuelve codificación ASCII cuyos binarios comienzan en 01... (considerando 7 bits)