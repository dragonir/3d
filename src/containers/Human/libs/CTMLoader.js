/* eslint-disable */

var LZMA = LZMA || {};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = LZMA;

}

LZMA.OutWindow = function() {
	this._windowSize = 0;
};

LZMA.OutWindow.prototype.create = function(windowSize) {
	if ( (!this._buffer) || (this._windowSize !== windowSize) ) {
		this._buffer = [];
	}
	this._windowSize = windowSize;
	this._pos = 0;
	this._streamPos = 0;
};

LZMA.OutWindow.prototype.flush = function() {
	var size = this._pos - this._streamPos;
	if (size !== 0) {
		while (size --) {
			this._stream.writeByte(this._buffer[this._streamPos ++]);
		}
		if (this._pos >= this._windowSize) {
			this._pos = 0;
		}
		this._streamPos = this._pos;
	}
};

LZMA.OutWindow.prototype.releaseStream = function() {
	this.flush();
	this._stream = null;
};

LZMA.OutWindow.prototype.setStream = function(stream) {
	this.releaseStream();
	this._stream = stream;
};

LZMA.OutWindow.prototype.init = function(solid) {
	if (!solid) {
		this._streamPos = 0;
		this._pos = 0;
	}
};

LZMA.OutWindow.prototype.copyBlock = function(distance, len) {
	var pos = this._pos - distance - 1;
	if (pos < 0) {
		pos += this._windowSize;
	}
	while (len --) {
		if (pos >= this._windowSize) {
			pos = 0;
		}
		this._buffer[this._pos ++] = this._buffer[pos ++];
		if (this._pos >= this._windowSize) {
			this.flush();
		}
	}
};

LZMA.OutWindow.prototype.putByte = function(b) {
	this._buffer[this._pos ++] = b;
	if (this._pos >= this._windowSize) {
		this.flush();
	}
};

LZMA.OutWindow.prototype.getByte = function(distance) {
	var pos = this._pos - distance - 1;
	if (pos < 0) {
		pos += this._windowSize;
	}
	return this._buffer[pos];
};

LZMA.RangeDecoder = function() {
};

LZMA.RangeDecoder.prototype.setStream = function(stream) {
	this._stream = stream;
};

LZMA.RangeDecoder.prototype.releaseStream = function() {
	this._stream = null;
};

LZMA.RangeDecoder.prototype.init = function() {
	var i = 5;

	this._code = 0;
	this._range = -1;
  
	while (i --) {
		this._code = (this._code << 8) | this._stream.readByte();
	}
};

LZMA.RangeDecoder.prototype.decodeDirectBits = function(numTotalBits) {
	var result = 0, i = numTotalBits, t;

	while (i --) {
		this._range >>>= 1;
		t = (this._code - this._range) >>> 31;
		this._code -= this._range & (t - 1);
		result = (result << 1) | (1 - t);

		if ( (this._range & 0xff000000) === 0) {
			this._code = (this._code << 8) | this._stream.readByte();
			this._range <<= 8;
		}
	}

	return result;
};

LZMA.RangeDecoder.prototype.decodeBit = function(probs, index) {
	var prob = probs[index],
      newBound = (this._range >>> 11) * prob;

	if ( (this._code ^ 0x80000000) < (newBound ^ 0x80000000) ) {
		this._range = newBound;
		probs[index] += (2048 - prob) >>> 5;
		if ( (this._range & 0xff000000) === 0) {
			this._code = (this._code << 8) | this._stream.readByte();
			this._range <<= 8;
		}
		return 0;
	}

	this._range -= newBound;
	this._code -= newBound;
	probs[index] -= prob >>> 5;
	if ( (this._range & 0xff000000) === 0) {
		this._code = (this._code << 8) | this._stream.readByte();
		this._range <<= 8;
	}
	return 1;
};

LZMA.initBitModels = function(probs, len) {
	while (len --) {
		probs[len] = 1024;
	}
};

LZMA.BitTreeDecoder = function(numBitLevels) {
	this._models = [];
	this._numBitLevels = numBitLevels;
};

LZMA.BitTreeDecoder.prototype.init = function() {
	LZMA.initBitModels(this._models, 1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.decode = function(rangeDecoder) {
	var m = 1, i = this._numBitLevels;

	while (i --) {
		m = (m << 1) | rangeDecoder.decodeBit(this._models, m);
	}
	return m - (1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.reverseDecode = function(rangeDecoder) {
	var m = 1, symbol = 0, i = 0, bit;

	for (; i < this._numBitLevels; ++ i) {
		bit = rangeDecoder.decodeBit(this._models, m);
		m = (m << 1) | bit;
		symbol |= bit << i;
	}
	return symbol;
};

LZMA.reverseDecode2 = function(models, startIndex, rangeDecoder, numBitLevels) {
	var m = 1, symbol = 0, i = 0, bit;

	for (; i < numBitLevels; ++ i) {
		bit = rangeDecoder.decodeBit(models, startIndex + m);
		m = (m << 1) | bit;
		symbol |= bit << i;
	}
	return symbol;
};

LZMA.LenDecoder = function() {
	this._choice = [];
	this._lowCoder = [];
	this._midCoder = [];
	this._highCoder = new LZMA.BitTreeDecoder(8);
	this._numPosStates = 0;
};

LZMA.LenDecoder.prototype.create = function(numPosStates) {
	for (; this._numPosStates < numPosStates; ++ this._numPosStates) {
		this._lowCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
		this._midCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
	}
};

LZMA.LenDecoder.prototype.init = function() {
	var i = this._numPosStates;
	LZMA.initBitModels(this._choice, 2);
	while (i --) {
		this._lowCoder[i].init();
		this._midCoder[i].init();
	}
	this._highCoder.init();
};

LZMA.LenDecoder.prototype.decode = function(rangeDecoder, posState) {
	if (rangeDecoder.decodeBit(this._choice, 0) === 0) {
		return this._lowCoder[posState].decode(rangeDecoder);
	}
	if (rangeDecoder.decodeBit(this._choice, 1) === 0) {
		return 8 + this._midCoder[posState].decode(rangeDecoder);
	}
	return 16 + this._highCoder.decode(rangeDecoder);
};

LZMA.Decoder2 = function() {
	this._decoders = [];
};

LZMA.Decoder2.prototype.init = function() {
	LZMA.initBitModels(this._decoders, 0x300);
};

LZMA.Decoder2.prototype.decodeNormal = function(rangeDecoder) {
	var symbol = 1;

	do {
		symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
	}while (symbol < 0x100);

	return symbol & 0xff;
};

LZMA.Decoder2.prototype.decodeWithMatchByte = function(rangeDecoder, matchByte) {
	var symbol = 1, matchBit, bit;

	do {
		matchBit = (matchByte >> 7) & 1;
		matchByte <<= 1;
		bit = rangeDecoder.decodeBit(this._decoders, ( (1 + matchBit) << 8) + symbol);
		symbol = (symbol << 1) | bit;
		if (matchBit !== bit) {
			while (symbol < 0x100) {
				symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
			}
			break;
		}
	}while (symbol < 0x100);

	return symbol & 0xff;
};

LZMA.LiteralDecoder = function() {
};

LZMA.LiteralDecoder.prototype.create = function(numPosBits, numPrevBits) {
	var i;

	if (this._coders
    && (this._numPrevBits === numPrevBits)
    && (this._numPosBits === numPosBits) ) {
		return;
	}
	this._numPosBits = numPosBits;
	this._posMask = (1 << numPosBits) - 1;
	this._numPrevBits = numPrevBits;

	this._coders = [];

	i = 1 << (this._numPrevBits + this._numPosBits);
	while (i --) {
		this._coders[i] = new LZMA.Decoder2();
	}
};

LZMA.LiteralDecoder.prototype.init = function() {
	var i = 1 << (this._numPrevBits + this._numPosBits);
	while (i --) {
		this._coders[i].init();
	}
};

LZMA.LiteralDecoder.prototype.getDecoder = function(pos, prevByte) {
	return this._coders[( (pos & this._posMask) << this._numPrevBits)
    + ( (prevByte & 0xff) >>> (8 - this._numPrevBits) )];
};

LZMA.Decoder = function() {
	this._outWindow = new LZMA.OutWindow();
	this._rangeDecoder = new LZMA.RangeDecoder();
	this._isMatchDecoders = [];
	this._isRepDecoders = [];
	this._isRepG0Decoders = [];
	this._isRepG1Decoders = [];
	this._isRepG2Decoders = [];
	this._isRep0LongDecoders = [];
	this._posSlotDecoder = [];
	this._posDecoders = [];
	this._posAlignDecoder = new LZMA.BitTreeDecoder(4);
	this._lenDecoder = new LZMA.LenDecoder();
	this._repLenDecoder = new LZMA.LenDecoder();
	this._literalDecoder = new LZMA.LiteralDecoder();
	this._dictionarySize = -1;
	this._dictionarySizeCheck = -1;

	this._posSlotDecoder[0] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[1] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[2] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[3] = new LZMA.BitTreeDecoder(6);
};

LZMA.Decoder.prototype.setDictionarySize = function(dictionarySize) {
	if (dictionarySize < 0) {
		return false;
	}
	if (this._dictionarySize !== dictionarySize) {
		this._dictionarySize = dictionarySize;
		this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);
		this._outWindow.create( Math.max(this._dictionarySizeCheck, 4096) );
	}
	return true;
};

LZMA.Decoder.prototype.setLcLpPb = function(lc, lp, pb) {
	var numPosStates = 1 << pb;

	if (lc > 8 || lp > 4 || pb > 4) {
		return false;
	}

	this._literalDecoder.create(lp, lc);

	this._lenDecoder.create(numPosStates);
	this._repLenDecoder.create(numPosStates);
	this._posStateMask = numPosStates - 1;

	return true;
};

LZMA.Decoder.prototype.init = function() {
	var i = 4;

	this._outWindow.init(false);

	LZMA.initBitModels(this._isMatchDecoders, 192);
	LZMA.initBitModels(this._isRep0LongDecoders, 192);
	LZMA.initBitModels(this._isRepDecoders, 12);
	LZMA.initBitModels(this._isRepG0Decoders, 12);
	LZMA.initBitModels(this._isRepG1Decoders, 12);
	LZMA.initBitModels(this._isRepG2Decoders, 12);
	LZMA.initBitModels(this._posDecoders, 114);

	this._literalDecoder.init();

	while (i --) {
		this._posSlotDecoder[i].init();
	}

	this._lenDecoder.init();
	this._repLenDecoder.init();
	this._posAlignDecoder.init();
	this._rangeDecoder.init();
};

LZMA.Decoder.prototype.decode = function(inStream, outStream, outSize) {
	var state = 0, rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0, nowPos64 = 0, prevByte = 0,
      posState, decoder2, len, distance, posSlot, numDirectBits;

	this._rangeDecoder.setStream(inStream);
	this._outWindow.setStream(outStream);

	this.init();

	while (outSize < 0 || nowPos64 < outSize) {
		posState = nowPos64 & this._posStateMask;

		if (this._rangeDecoder.decodeBit(this._isMatchDecoders, (state << 4) + posState) === 0) {
			decoder2 = this._literalDecoder.getDecoder(nowPos64 ++, prevByte);

			if (state >= 7) {
				prevByte = decoder2.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(rep0) );
			}else {
				prevByte = decoder2.decodeNormal(this._rangeDecoder);
			}
			this._outWindow.putByte(prevByte);

			state = state < 4 ? 0 : state - (state < 10 ? 3 : 6);

		}else {

			if (this._rangeDecoder.decodeBit(this._isRepDecoders, state) === 1) {
				len = 0;
				if (this._rangeDecoder.decodeBit(this._isRepG0Decoders, state) === 0) {
					if (this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (state << 4) + posState) === 0) {
						state = state < 7 ? 9 : 11;
						len = 1;
					}
				}else {
					if (this._rangeDecoder.decodeBit(this._isRepG1Decoders, state) === 0) {
						distance = rep1;
					}else {
						if (this._rangeDecoder.decodeBit(this._isRepG2Decoders, state) === 0) {
							distance = rep2;
						}else {
							distance = rep3;
							rep3 = rep2;
						}
						rep2 = rep1;
					}
					rep1 = rep0;
					rep0 = distance;
				}
				if (len === 0) {
					len = 2 + this._repLenDecoder.decode(this._rangeDecoder, posState);
					state = state < 7 ? 8 : 11;
				}
			}else {
				rep3 = rep2;
				rep2 = rep1;
				rep1 = rep0;

				len = 2 + this._lenDecoder.decode(this._rangeDecoder, posState);
				state = state < 7 ? 7 : 10;

				posSlot = this._posSlotDecoder[len <= 5 ? len - 2 : 3].decode(this._rangeDecoder);
				if (posSlot >= 4) {

					numDirectBits = (posSlot >> 1) - 1;
					rep0 = (2 | (posSlot & 1) ) << numDirectBits;

					if (posSlot < 14) {
						rep0 += LZMA.reverseDecode2(this._posDecoders,
                rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);
					}else {
						rep0 += this._rangeDecoder.decodeDirectBits(numDirectBits - 4) << 4;
						rep0 += this._posAlignDecoder.reverseDecode(this._rangeDecoder);
						if (rep0 < 0) {
							if (rep0 === -1) {
								break;
							}
							return false;
						}
					}
				}else {
					rep0 = posSlot;
				}
			}

			if (rep0 >= nowPos64 || rep0 >= this._dictionarySizeCheck) {
				return false;
			}

			this._outWindow.copyBlock(rep0, len);
			nowPos64 += len;
			prevByte = this._outWindow.getByte(0);
		}
	}

	this._outWindow.flush();
	this._outWindow.releaseStream();
	this._rangeDecoder.releaseStream();

	return true;
};

LZMA.Decoder.prototype.setDecoderProperties = function(properties) {
	var value, lc, lp, pb, dictionarySize;

	if (properties.size < 5) {
		return false;
	}

	value = properties.readByte();
	lc = value % 9;
	value = ~~(value / 9);
	lp = value % 5;
	pb = ~~(value / 5);

	if ( !this.setLcLpPb(lc, lp, pb) ) {
		return false;
	}

	dictionarySize = properties.readByte();
	dictionarySize |= properties.readByte() << 8;
	dictionarySize |= properties.readByte() << 16;
	dictionarySize += properties.readByte() * 16777216;

	return this.setDictionarySize(dictionarySize);
};

LZMA.decompress = function(properties, inStream, outStream, outSize) {
	var decoder = new LZMA.Decoder();

	if ( !decoder.setDecoderProperties(properties) ) {
		throw "Incorrect stream properties";
	}

	if ( !decoder.decode(inStream, outStream, outSize) ) {
		throw "Error in data stream";
	}

	return true;
};


/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "OpenCTM: The Open Compressed Triangle Mesh file format" by Marcus Geelnard
  http://openctm.sourceforge.net/
*/

var CTM = CTM || {};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = CTM;

}

CTM.CompressionMethod = {
  RAW: 0x00574152,
  MG1: 0x0031474d,
  MG2: 0x0032474d
};

CTM.Flags = {
  NORMALS: 0x00000001
};

CTM.File = function(stream) {
	this.load(stream);
};

CTM.File.prototype.load = function(stream) {
	this.header = new CTM.FileHeader(stream);

	this.body = new CTM.FileBody(this.header);
  
	this.getReader().read(stream, this.body);
};

CTM.File.prototype.getReader = function() {
	var reader;

	switch (this.header.compressionMethod){
		case CTM.CompressionMethod.RAW:
			reader = new CTM.ReaderRAW();
			break;
		case CTM.CompressionMethod.MG1:
			reader = new CTM.ReaderMG1();
			break;
		case CTM.CompressionMethod.MG2:
			reader = new CTM.ReaderMG2();
			break;
	}

	return reader;
};

CTM.FileHeader = function(stream) {
	stream.readInt32(); //magic "OCTM"
	this.fileFormat = stream.readInt32();
	this.compressionMethod = stream.readInt32();
	this.vertexCount = stream.readInt32();
	this.triangleCount = stream.readInt32();
	this.uvMapCount = stream.readInt32();
	this.attrMapCount = stream.readInt32();
	this.flags = stream.readInt32();
	this.comment = stream.readString();
};

CTM.FileHeader.prototype.hasNormals = function() {
	return this.flags & CTM.Flags.NORMALS;
};

CTM.FileBody = function(header) {
	var i = header.triangleCount * 3,
      v = header.vertexCount * 3,
      n = header.hasNormals() ? header.vertexCount * 3 : 0,
      u = header.vertexCount * 2,
      a = header.vertexCount * 4,
      j = 0;

	var data = new ArrayBuffer(
    (i + v + n + (u * header.uvMapCount) + (a * header.attrMapCount) ) * 4);

	this.indices = new Uint32Array(data, 0, i);

	this.vertices = new Float32Array(data, i * 4, v);

	if ( header.hasNormals() ) {
		this.normals = new Float32Array(data, (i + v) * 4, n);
	}
  
	if (header.uvMapCount) {
		this.uvMaps = [];
		for (j = 0; j < header.uvMapCount; ++ j) {
			this.uvMaps[j] = { uv: new Float32Array(data,
        (i + v + n + (j * u) ) * 4, u) };
		}
	}
  
	if (header.attrMapCount) {
		this.attrMaps = [];
		for (j = 0; j < header.attrMapCount; ++ j) {
			this.attrMaps[j] = { attr: new Float32Array(data,
        (i + v + n + (u * header.uvMapCount) + (j * a) ) * 4, a) };
		}
	}
};

CTM.FileMG2Header = function(stream) {
	stream.readInt32(); //magic "MG2H"
	this.vertexPrecision = stream.readFloat32();
	this.normalPrecision = stream.readFloat32();
	this.lowerBoundx = stream.readFloat32();
	this.lowerBoundy = stream.readFloat32();
	this.lowerBoundz = stream.readFloat32();
	this.higherBoundx = stream.readFloat32();
	this.higherBoundy = stream.readFloat32();
	this.higherBoundz = stream.readFloat32();
	this.divx = stream.readInt32();
	this.divy = stream.readInt32();
	this.divz = stream.readInt32();
  
	this.sizex = (this.higherBoundx - this.lowerBoundx) / this.divx;
	this.sizey = (this.higherBoundy - this.lowerBoundy) / this.divy;
	this.sizez = (this.higherBoundz - this.lowerBoundz) / this.divz;
};

CTM.ReaderRAW = function() {
};

CTM.ReaderRAW.prototype.read = function(stream, body) {
	this.readIndices(stream, body.indices);
	this.readVertices(stream, body.vertices);
  
	if (body.normals) {
		this.readNormals(stream, body.normals);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderRAW.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readArrayInt32(indices);
};

CTM.ReaderRAW.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readArrayFloat32(vertices);
};

CTM.ReaderRAW.prototype.readNormals = function(stream, normals) {
	stream.readInt32(); //magic "NORM"
	stream.readArrayFloat32(normals);
};

CTM.ReaderRAW.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
		stream.readArrayFloat32(uvMaps[i].uv);
	}
};

CTM.ReaderRAW.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
		stream.readArrayFloat32(attrMaps[i].attr);
	}
};

CTM.ReaderMG1 = function() {
};

CTM.ReaderMG1.prototype.read = function(stream, body) {
	this.readIndices(stream, body.indices);
	this.readVertices(stream, body.vertices);
  
	if (body.normals) {
		this.readNormals(stream, body.normals);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderMG1.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readInt32(); //packed size
  
	var interleaved = new CTM.InterleavedStream(indices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	CTM.restoreIndices(indices, indices.length);
};

CTM.ReaderMG1.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readInt32(); //packed size
  
	var interleaved = new CTM.InterleavedStream(vertices, 1);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
};

CTM.ReaderMG1.prototype.readNormals = function(stream, normals) {
	stream.readInt32(); //magic "NORM"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(normals, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
};

CTM.ReaderMG1.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(uvMaps[i].uv, 2);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
	}
};

CTM.ReaderMG1.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(attrMaps[i].attr, 4);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
	}
};

CTM.ReaderMG2 = function() {
};

CTM.ReaderMG2.prototype.read = function(stream, body) {
	this.MG2Header = new CTM.FileMG2Header(stream);
  
	this.readVertices(stream, body.vertices);
	this.readIndices(stream, body.indices);
  
	if (body.normals) {
		this.readNormals(stream, body);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderMG2.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(vertices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  
	var gridIndices = this.readGridIndices(stream, vertices);
  
	CTM.restoreVertices(vertices, this.MG2Header, gridIndices, this.MG2Header.vertexPrecision);
};

CTM.ReaderMG2.prototype.readGridIndices = function(stream, vertices) {
	stream.readInt32(); //magic "GIDX"
	stream.readInt32(); //packed size
  
	var gridIndices = new Uint32Array(vertices.length / 3);
  
	var interleaved = new CTM.InterleavedStream(gridIndices, 1);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  
	CTM.restoreGridIndices(gridIndices, gridIndices.length);
  
	return gridIndices;
};

CTM.ReaderMG2.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(indices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	CTM.restoreIndices(indices, indices.length);
};

CTM.ReaderMG2.prototype.readNormals = function(stream, body) {
	stream.readInt32(); //magic "NORM"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(body.normals, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	var smooth = CTM.calcSmoothNormals(body.indices, body.vertices);

	CTM.restoreNormals(body.normals, smooth, this.MG2Header.normalPrecision);
};

CTM.ReaderMG2.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
    
		var precision = stream.readFloat32();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(uvMaps[i].uv, 2);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    
		CTM.restoreMap(uvMaps[i].uv, 2, precision);
	}
};

CTM.ReaderMG2.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
    
		var precision = stream.readFloat32();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(attrMaps[i].attr, 4);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    
		CTM.restoreMap(attrMaps[i].attr, 4, precision);
	}
};

CTM.restoreIndices = function(indices, len) {
	var i = 3;
	if (len > 0) {
		indices[2] += indices[0];
		indices[1] += indices[0];
	}
	for (; i < len; i += 3) {
		indices[i] += indices[i - 3];
    
		if (indices[i] === indices[i - 3]) {
			indices[i + 1] += indices[i - 2];
		}else {
			indices[i + 1] += indices[i];
		}

		indices[i + 2] += indices[i];
	}
};

CTM.restoreGridIndices = function(gridIndices, len) {
	var i = 1;
	for (; i < len; ++ i) {
		gridIndices[i] += gridIndices[i - 1];
	}
};

CTM.restoreVertices = function(vertices, grid, gridIndices, precision) {
	var gridIdx, delta, x, y, z,
      intVertices = new Uint32Array(vertices.buffer, vertices.byteOffset, vertices.length),
      ydiv = grid.divx, zdiv = ydiv * grid.divy,
      prevGridIdx = 0x7fffffff, prevDelta = 0,
      i = 0, j = 0, len = gridIndices.length;

	for (; i < len; j += 3) {
		x = gridIdx = gridIndices[i ++];
    
		z = ~~(x / zdiv);
		x -= ~~(z * zdiv);
		y = ~~(x / ydiv);
		x -= ~~(y * ydiv);

		delta = intVertices[j];
		if (gridIdx === prevGridIdx) {
			delta += prevDelta;
		}

		vertices[j]     = grid.lowerBoundx +
      x * grid.sizex + precision * delta;
		vertices[j + 1] = grid.lowerBoundy +
      y * grid.sizey + precision * intVertices[j + 1];
		vertices[j + 2] = grid.lowerBoundz +
      z * grid.sizez + precision * intVertices[j + 2];

		prevGridIdx = gridIdx;
		prevDelta = delta;
	}
};

CTM.restoreNormals = function(normals, smooth, precision) {
	var ro, phi, theta, sinPhi,
      nx, ny, nz, by, bz, len,
      intNormals = new Uint32Array(normals.buffer, normals.byteOffset, normals.length),
      i = 0, k = normals.length,
      PI_DIV_2 = 3.141592653589793238462643 * 0.5;

	for (; i < k; i += 3) {
		ro = intNormals[i] * precision;
		phi = intNormals[i + 1];

		if (phi === 0) {
			normals[i]     = smooth[i]     * ro;
			normals[i + 1] = smooth[i + 1] * ro;
			normals[i + 2] = smooth[i + 2] * ro;
		}else {
      
			if (phi <= 4) {
				theta = (intNormals[i + 2] - 2) * PI_DIV_2;
			}else {
				theta = ( (intNormals[i + 2] * 4 / phi) - 2) * PI_DIV_2;
			}
      
			phi *= precision * PI_DIV_2;
			sinPhi = ro * Math.sin(phi);

			nx = sinPhi * Math.cos(theta);
			ny = sinPhi * Math.sin(theta);
			nz = ro * Math.cos(phi);

			bz = smooth[i + 1];
			by = smooth[i] - smooth[i + 2];

			len = Math.sqrt(2 * bz * bz + by * by);
			if (len > 1e-20) {
				by /= len;
				bz /= len;
			}

			normals[i]     = smooth[i]     * nz +
        (smooth[i + 1] * bz - smooth[i + 2] * by) * ny - bz * nx;
			normals[i + 1] = smooth[i + 1] * nz -
        (smooth[i + 2]      + smooth[i]   ) * bz  * ny + by * nx;
			normals[i + 2] = smooth[i + 2] * nz +
        (smooth[i]     * by + smooth[i + 1] * bz) * ny + bz * nx;
		}
	}
};

CTM.restoreMap = function(map, count, precision) {
	var delta, value,
      intMap = new Uint32Array(map.buffer, map.byteOffset, map.length),
      i = 0, j, len = map.length;

	for (; i < count; ++ i) {
		delta = 0;

		for (j = i; j < len; j += count) {
			value = intMap[j];
      
			delta += value & 1 ? -( (value + 1) >> 1) : value >> 1;
      
			map[j] = delta * precision;
		}
	}
};

CTM.calcSmoothNormals = function(indices, vertices) {
	var smooth = new Float32Array(vertices.length),
      indx, indy, indz, nx, ny, nz,
      v1x, v1y, v1z, v2x, v2y, v2z, len,
      i, k;

	for (i = 0, k = indices.length; i < k;) {
		indx = indices[i ++] * 3;
		indy = indices[i ++] * 3;
		indz = indices[i ++] * 3;

		v1x = vertices[indy]     - vertices[indx];
		v2x = vertices[indz]     - vertices[indx];
		v1y = vertices[indy + 1] - vertices[indx + 1];
		v2y = vertices[indz + 1] - vertices[indx + 1];
		v1z = vertices[indy + 2] - vertices[indx + 2];
		v2z = vertices[indz + 2] - vertices[indx + 2];
    
		nx = v1y * v2z - v1z * v2y;
		ny = v1z * v2x - v1x * v2z;
		nz = v1x * v2y - v1y * v2x;
    
		len = Math.sqrt(nx * nx + ny * ny + nz * nz);
		if (len > 1e-10) {
			nx /= len;
			ny /= len;
			nz /= len;
		}
    
		smooth[indx]     += nx;
		smooth[indx + 1] += ny;
		smooth[indx + 2] += nz;
		smooth[indy]     += nx;
		smooth[indy + 1] += ny;
		smooth[indy + 2] += nz;
		smooth[indz]     += nx;
		smooth[indz + 1] += ny;
		smooth[indz + 2] += nz;
	}

	for (i = 0, k = smooth.length; i < k; i += 3) {
		len = Math.sqrt(smooth[i] * smooth[i] + 
      smooth[i + 1] * smooth[i + 1] +
      smooth[i + 2] * smooth[i + 2]);

		if (len > 1e-10) {
			smooth[i]     /= len;
			smooth[i + 1] /= len;
			smooth[i + 2] /= len;
		}
	}

	return smooth;
};

CTM.isLittleEndian = (function() {
	var buffer = new ArrayBuffer(2),
      bytes = new Uint8Array(buffer),
      ints = new Uint16Array(buffer);

	bytes[0] = 1;

	return ints[0] === 1;
}());

CTM.InterleavedStream = function(data, count) {
	this.data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	this.offset = CTM.isLittleEndian ? 3 : 0;
	this.count = count * 4;
	this.len = this.data.length;
};

CTM.InterleavedStream.prototype.writeByte = function(value) {
	this.data[this.offset] = value;
  
	this.offset += this.count;
	if (this.offset >= this.len) {
  
		this.offset -= this.len - 4;
		if (this.offset >= this.count) {
    
			this.offset -= this.count + (CTM.isLittleEndian ? 1 : -1);
		}
	}
};

CTM.Stream = function(data) {
	this.data = data;
	this.offset = 0;
};

CTM.Stream.prototype.TWO_POW_MINUS23 = Math.pow(2, -23);

CTM.Stream.prototype.TWO_POW_MINUS126 = Math.pow(2, -126);

CTM.Stream.prototype.readByte = function() {
	return this.data[this.offset ++] & 0xff;
};

CTM.Stream.prototype.readInt32 = function() {
	var i = this.readByte();
	i |= this.readByte() << 8;
	i |= this.readByte() << 16;
	return i | (this.readByte() << 24);
};

CTM.Stream.prototype.readFloat32 = function() {
	var m = this.readByte();
	m += this.readByte() << 8;

	var b1 = this.readByte();
	var b2 = this.readByte();

	m += (b1 & 0x7f) << 16; 
	var e = ( (b2 & 0x7f) << 1) | ( (b1 & 0x80) >>> 7);
	var s = b2 & 0x80 ? -1 : 1;

	if (e === 255) {
		return m !== 0 ? NaN : s * Infinity;
	}
	if (e > 0) {
		return s * (1 + (m * this.TWO_POW_MINUS23) ) * Math.pow(2, e - 127);
	}
	if (m !== 0) {
		return s * m * this.TWO_POW_MINUS126;
	}
	return s * 0;
};

CTM.Stream.prototype.readString = function() {
	var len = this.readInt32();

	this.offset += len;

	return String.fromCharCode.apply(null, this.data.subarray(this.offset - len, this.offset));
};

CTM.Stream.prototype.readArrayInt32 = function(array) {
	var i = 0, len = array.length;
  
	while (i < len) {
		array[i ++] = this.readInt32();
	}

	return array;
};

CTM.Stream.prototype.readArrayFloat32 = function(array) {
	var i = 0, len = array.length;

	while (i < len) {
		array[i ++] = this.readFloat32();
	}

	return array;
};


/**
 * Loader for CTM encoded models generated by OpenCTM tools:
 *	http://openctm.sourceforge.net/
 *
 * Uses js-openctm library by Juan Mellado
 *	http://code.google.com/p/js-openctm/
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CTMLoader = function () {

	THREE.Loader.call( this );

};

THREE.CTMLoader.prototype = Object.create( THREE.Loader.prototype );
THREE.CTMLoader.prototype.constructor = THREE.CTMLoader;

// Load multiple CTM parts defined in JSON

THREE.CTMLoader.prototype.loadParts = function ( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var xhr = new XMLHttpRequest();

	var basePath = parameters.basePath ? parameters.basePath : THREE.LoaderUtils.extractUrlBase( url );

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var jsonObject = JSON.parse( xhr.responseText );

				var materials = [], geometries = [], counter = 0;

				function callbackFinal( geometry ) {

					counter += 1;

					geometries.push( geometry );

					if ( counter === jsonObject.offsets.length ) {

						callback( geometries, materials );

					}

				}


				// init materials

				for ( var i = 0; i < jsonObject.materials.length; i ++ ) {

					materials[ i ] = scope.createMaterial( jsonObject.materials[ i ], basePath );

				}

				// load joined CTM file

				var partUrl = basePath + jsonObject.data;
				var parametersPart = { useWorker: parameters.useWorker, worker: parameters.worker, offsets: jsonObject.offsets };
				scope.load( partUrl, callbackFinal, parametersPart );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

// Load CTMLoader compressed models
//	- parameters
//		- url (required)
//		- callback (required)

THREE.CTMLoader.prototype.load = function ( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var offsets = parameters.offsets !== undefined ? parameters.offsets : [ 0 ];

	var xhr = new XMLHttpRequest(),
		callbackProgress = null;

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var binaryData = new Uint8Array( xhr.response );

				var s = Date.now();

				if ( parameters.useWorker ) {

					var worker = parameters.worker || new Worker( 'js/loaders/ctm/CTMWorker.js' );

					worker.onmessage = function ( event ) {

						var files = event.data;

						for ( var i = 0; i < files.length; i ++ ) {

							var ctmFile = files[ i ];

							var e1 = Date.now();
							// console.log( "CTM data parse time [worker]: " + (e1-s) + " ms" );

							scope.createModel( ctmFile, callback );

							var e = Date.now();
							console.log( "model load time [worker]: " + ( e - e1 ) + " ms, total: " + ( e - s ) );

						}


					};

					worker.postMessage( { "data": binaryData, "offsets": offsets }, [ binaryData.buffer ] );

				} else {

					for ( var i = 0; i < offsets.length; i ++ ) {

						var stream = new CTM.Stream( binaryData );
						stream.offset = offsets[ i ];

						var ctmFile = new CTM.File( stream );

						scope.createModel( ctmFile, callback );

					}

					//var e = Date.now();
					//console.log( "CTM data parse time [inline]: " + (e-s) + " ms" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState === 3 ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	};

	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";

	xhr.send( null );

};


THREE.CTMLoader.prototype.createModel = function ( file, callback ) {

	var Model = function () {

		THREE.BufferGeometry.call( this );

		this.materials = [];

		var indices = file.body.indices;
		var positions = file.body.vertices;
		var normals = file.body.normals;

		var uvs, colors;

		var uvMaps = file.body.uvMaps;

		if ( uvMaps !== undefined && uvMaps.length > 0 ) {

			uvs = uvMaps[ 0 ].uv;

		}

		var attrMaps = file.body.attrMaps;

		if ( attrMaps !== undefined && attrMaps.length > 0 && attrMaps[ 0 ].name === 'Color' ) {

			colors = attrMaps[ 0 ].attr;

		}

		this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
		this.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		if ( normals !== undefined ) {

			this.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		}

		if ( uvs !== undefined ) {

			this.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

		}

		if ( colors !== undefined ) {

			this.setAttribute( 'color', new THREE.BufferAttribute( colors, 4 ) );

		}

	};

	Model.prototype = Object.create( THREE.BufferGeometry.prototype );
	Model.prototype.constructor = Model;

	var geometry = new Model();

	// compute vertex normals if not present in the CTM model
	if ( geometry.attributes.normal === undefined ) {

		geometry.computeVertexNormals();

	}

	callback( geometry );

};
