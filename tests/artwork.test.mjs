import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { lensMarkup } from '../site/artwork.mjs';

test('compact linework preserves all 6510 original vertices without closing or approximating paths', () => {
  const svg = lensMarkup();
  const paths = [...svg.matchAll(/<path d="M([^"]+)"/g)].map((match) => {
    const [first, remainder] = match[1].split('l');
    let [x, y] = first.split(',').map((value) => Math.round(Number(value) * 10));
    const points = [[x / 10, y / 10]];
    for (const pair of remainder.split(' ')) {
      const [dx, dy] = pair.split(',').map((value) => Math.round(Number(value) * 10));
      x += dx;
      y += dy;
      points.push([x / 10, y / 10]);
    }
    assert.equal(points.length, 105);
    return points;
  });
  assert.equal(paths.length, 62);
  // Absolute 0.1px vertices captured from the original ecde6a2 geometry, before serialization changed.
  assert.equal(createHash('sha256').update(JSON.stringify(paths)).digest('hex'), 'd547bfef256a18f3989d0f37a7ef19990d04e87e274714cb0a9cdb5e323f7e5a');
  assert.ok(Buffer.byteLength(svg) < 60000, 'Keep the linework below its original 80,261-byte size');
  assert.match(svg, /aria-hidden="true"/);
});
