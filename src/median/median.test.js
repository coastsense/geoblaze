import test from "flug";
import { serve } from "srvd";
import load from "../load";
import median from "./median.module";

serve({ debug: true, max: 1, port: 3000 });

const url = "http://localhost:3000/data/test.tiff";

const bbox = [80.63, 7.42, 84.21, 10.1];
const expectedBboxValue = 906.7;

const bboxGeojson = `{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [83.583984375, 19.89072302399691], [86.1328125, 19.89072302399691],
        [86.1328125, 21.69826549685252], [83.583984375, 21.69826549685252],
        [83.583984375, 19.89072302399691]
      ]]
    }
  }]
}`;
const expectedBboxGeojsonValue = 1849.4;

const polygon = [
  [
    [83.12255859375, 22.49225722008518],
    [82.96875, 21.57571893245848],
    [81.58447265624999, 1.207458730482642],
    [83.07861328125, 20.34462694382967],
    [83.8037109375, 19.497664168139053],
    [84.814453125, 19.766703551716976],
    [85.078125, 21.166483858206583],
    [86.044921875, 20.838277806058933],
    [86.98974609375, 22.49225722008518],
    [85.58349609375, 24.54712317973075],
    [84.6826171875, 23.36242859340884],
    [83.12255859375, 22.49225722008518]
  ]
];
const expectedPolygonValue = 1537.2;

test("Get Median from Bounding Box", async ({ eq }) => {
  const georaster = await load(url);
  const value = Number(median(georaster, bbox)[0].toFixed(2));
  eq(value, expectedBboxValue);
});

test("Get Median from Bounding Box (GeoJSON)", async ({ eq }) => {
  const georaster = await load(url);
  const value = Number(median(georaster, bboxGeojson)[0].toFixed(2));
  eq(value, expectedBboxGeojsonValue);
});

test("Get Median from Polygon", async ({ eq }) => {
  const georaster = await load(url);
  const value = Number(median(georaster, polygon)[0].toFixed(2));
  eq(value, expectedPolygonValue);
});

test("Get Median from Whole Raster", async ({ eq }) => {
  const georaster = await load(url);
  const value = median(georaster)[0];
  eq(value, 0);
});

test("Get Median from Bounding Box from url", async ({ eq }) => {
  const result = await median(url, bbox);
  const value = Number(result[0].toFixed(2));
  eq(value, expectedBboxValue);
});

test("Get Median from Bounding Box (GeoJSON) from url", async ({ eq }) => {
  const result = await median(url, bboxGeojson);
  const value = Number(result[0].toFixed(2));
  eq(value, expectedBboxGeojsonValue);
});

test("Get Median from Polygon from url", async ({ eq }) => {
  const result = await median(url, polygon);
  const value = Number(result[0].toFixed(2));
  eq(value, expectedPolygonValue);
});

test("Get Median from Whole Raster from url", async ({ eq }) => {
  const result = await median(url);
  const value = result[0];
  eq(value, 0);
});
