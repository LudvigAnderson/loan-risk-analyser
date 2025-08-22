import { ResponsiveLine } from "@nivo/line";

interface LineGraphProps {
  x: Array<number>;
  y: Array<number>;
  id: string;
  ymin?: number;
  ymax?: number;
  xmin?: number;
  xmax?: number;
  xlabel?: string;
  ylabel?: string;
  xPercent?: boolean;
  markerY?: number
}

export default function LineGraph({ x, y, id, ymin, ymax, xmin, xmax, xlabel, ylabel, xPercent, markerY }: LineGraphProps) {
  const seriesData = x.map((label, i) => ({ x: label, y: y[i] }));
  const data = [{ id: id, data: seriesData }];

  return (
    <div className="h-128 w-full">    
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{
          type: "linear",
          min: xmin != undefined ? xmin : 0,
          max: xmax != undefined ? xmax : 120,
        }}
        yScale={{
          type: "linear",
          min: ymin != undefined ? ymin : "auto",
          max: ymax != undefined ? ymax : "auto",
          stacked: false,
          reverse: false
        }}
        axisBottom={{
          format: xPercent ? value => `${(value * 100).toFixed(0)}%` : undefined,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: xlabel ? xlabel : "X axis",
          legendOffset: 36,
        }}
        axisLeft={{
          format: value => `${(value * 100).toFixed(0)}%`,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: ylabel ? ylabel : "Y axis",
          legendOffset: -40,
        }}
        enablePoints={true}
        pointSize={1}
        lineWidth={3}
        //useMesh={true}
        yFormat=",.2%"
        xFormat={xPercent ? ",.2%" : undefined}

        animate={false}
        
        enableArea={markerY != undefined}
        areaBaselineValue={markerY}
        areaOpacity={0.2}
        enableCrosshair={true}
        enableTouchCrosshair={true}
        legends={[]}
        colors={["#155dfc"]}
        enableSlices={"x"}
        sliceTooltip={({ slice }) => (
          <div className="bg-white p-2 whitespace-nowrap border border-gray-300 rounded-md shadow-md">
            {slice.points.map(point => (
              <div key={point.id} className="text-gray-900 font-semibold flex flex-col items-center">
                <span className="mr-2">{xlabel ? xlabel : "x"}: {point.data.xFormatted}:</span>
                <span className="text-blue-600">{point.data.yFormatted} {ylabel}</span>
              </div>
            ))}
          </div>
        )}
        markers={markerY == undefined ? [] : [
          {
            axis:"y",
            value:markerY,
            lineStyle: { stroke: "red", strokeWidth: 2, strokeDasharray: "4 4" },
          }
        ]}
      />
    </div>
  )
}