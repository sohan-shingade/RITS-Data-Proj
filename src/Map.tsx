import {
  Heading,
  Menu,
  MenuButton, MenuItem, MenuList, Text
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react'
import { Flex, Spacer, HStack, VStack } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { GeoJsonLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import React, { useEffect, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


interface CensusReporter_API {
    table_ids : string;
    tableStem: string;
    geo_ids : string;
    primary_geo_id : String;
}
interface InitalViewtype {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}
interface MapProps {
    data_ids: CensusReporter_API;
    viewport: InitalViewtype;
    mapsouce: string;
    multiTable: boolean;
  }
  // create title componenet for map which takees in the title and current selected row
  // create a select component which takes in the data and the selected row
interface TitleProps {
  title: any;
  row: any;
}
const APIKEY = 'pk.eyJ1Ijoic29oYW4tc2hpbmdhZGUiLCJhIjoiY2t5OWFqZjdsMDRpZjJ1cDgxMm1sM2cydyJ9.PRNLtFIS0nsxNkXFG4qiJw'
const Title = ({title, row} : TitleProps) => {
  return (
    <VStack alignItems={'flex-start'}>
      <Heading width={'70vw'} fontWeight={'black'} size={'lg'}>{title}</Heading>
      <HStack alignItems={'flex-start'} justifyContent={'flex-start'}><Heading size={'md'} fontWeight={'bold'}>Currently Showing </Heading><Heading size={'md'} fontWeight={'black'}>{row}</Heading></HStack>
    </VStack>
  )
}
function getTooltip({object}: any) {
  return (
    object && {
      html: `\
  <div><b>${object.properties.NAMELSAD10}</b></div>
  <div>${object.properties.curData} people</div>
  `
    }
  );
}

export default function Map({data_ids, multiTable, viewport, mapsouce}: MapProps) {
    const [data, setData] = useState<any>();
    const [json, setAllJSON] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [table, setTable] = useState<any>([]);
    const [max, setMax] = useState<number>(-1);
    // const [layers, setLayers] = useState<any>();
    const [map, setMap] = useState<any>();
   
    useEffect(() => {
        setSelectedRow(`${data_ids.table_ids}001`)
        if(multiTable){
          setSelectedRow(`${data_ids.tableStem}A`)
        }

        // console.log(selectedRow);
        
        const fetchData = async () => {
            console.log(data_ids, "data_ids");
          
            const response = await fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=${data_ids.table_ids}&geo_ids=${data_ids.geo_ids}&primary_geo_id=${data_ids.primary_geo_id}`);
            let newjson = await response.json();
            console.log("newjson", newjson);
            

            const map = await fetch(mapsouce);
            let mapjson = await map.json();

            mapjson.features = mapjson.features.map((feature:any) => {
              if(!feature.properties.GEOID10){
                return feature
              }
              let key = Object.keys(newjson.data).find((_key:any) => {
                return _key.indexOf(feature.properties.GEOID10) > -1;
              })
              
              if (key){
                if(!multiTable){
                  feature.properties = { ...feature.properties, 
                                        curData: newjson.data[key][data_ids.table_ids].estimate[`${data_ids.table_ids}001`] 
                                      };
                  if(max < newjson.data[key][data_ids.table_ids].estimate[`${data_ids.table_ids}001`]){
                    setMax(newjson.data[key][data_ids.table_ids].estimate[`${data_ids.table_ids}001`])
                  }
                }else{
                  feature.properties = { ...feature.properties, 
                    curData: newjson.data[key][`${data_ids.tableStem}A`].estimate[`${data_ids.tableStem}A001`] 
                  };
                  if(max < newjson.data[key][`${data_ids.tableStem}A`].estimate[`${data_ids.tableStem}A001`]){
                    setMax(newjson.data[key][`${data_ids.tableStem}A`].estimate[`${data_ids.tableStem}A001`])
                  }
                }
              }
              return feature;
            });
            let beans:any[] = []
            if(!multiTable){
              beans = Object.entries(newjson["tables"][data_ids.table_ids]["columns"]).map(([key, val]:any, i:any) => {
                return {id: key, label: val.name}
              })
            } else {
              beans = Object.entries(newjson["tables"]).map(([key, val]:any, i:any) => {
                return {id: key, label: val.title}
              })
              console.log(beans, "beans");
              
            }
            console.log(mapjson, "mapjson");
            
            setTable(beans)
            setMap(mapjson);
            return newjson;
          }
          fetchData().then((jb) => {
            setData(jb["data"]);
            setAllJSON(jb);
          });
    }, []);
    const layers = [
      new GeoJsonLayer({
        id: 'geojson',
        data: map,
        opacity: 0.7,
        extruded: true,
        pickable: true,
        getElevation: (d:any) => {
          if(d.properties.GEOID10 != null){
            let key = Object.keys(json.data).find((_key:any) => {
              return _key.indexOf(d.properties.GEOID10) > -1;
            })
            if(key) {
              if(!multiTable){
              if (d.properties.curData === json.data[key][data_ids.table_ids].estimate[`${data_ids.table_ids}001`])
                return d.properties.curData / max * 5000;
              else
                return d.properties.curData / max * 5000;
              } else {
                return d.properties.curData / max * 5000;
              }
            }
            else
              return 0;
          }
          else{
            return 10
          }
        },
        getFillColor: (d:any) => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
        lineWidthMinPixels: 2,
        stroked: true,
        
      })
    ];

    const updateDataCatagory = (row:any) => {
      setSelectedRow(row);
      setMax(-1);
      let newMax = -1;
      setMap({ ...map, 
        features: map.features.map((feature:any) => {
        if(!feature.properties.GEOID10){
          return feature
        }
        let key = Object.keys(json.data).find((_key:any) => {
          return _key.indexOf(feature.properties.GEOID10) > -1;
        })
        if (key){
          if(!multiTable){
            feature.properties = { ...feature.properties, 
                                  curData: json.data[key][data_ids.table_ids].estimate[row] 
                                };
            if(newMax < json.data[key][data_ids.table_ids].estimate[row]){
              console.log("new max", json.data[key][data_ids.table_ids].estimate[row], "old max", newMax);
              newMax = json.data[key][data_ids.table_ids].estimate[row]
            }
          }else{
            feature.properties = { ...feature.properties, 
              curData: ((json.data[key][row].estimate[`${row}005`] + json.data[key][row].estimate[`${row}006`] + json.data[key][row].estimate[`${row}010`]  + json.data[key][row].estimate[`${row}011`]))
            };
            console.log(feature, "feature.properties.curData");
            
            if(newMax < (json.data[key][row].estimate[`${row}005`] + json.data[key][row].estimate[`${row}006`] + json.data[key][row].estimate[`${row}010`]  + json.data[key][row].estimate[`${row}011`])){
              console.log("new max", (json.data[key][row].estimate[`${row}005`] + json.data[key][row].estimate[`${row}006`] + json.data[key][row].estimate[`${row}010`]  + json.data[key][row].estimate[`${row}011`]), "old max", newMax);
              newMax = (json.data[key][row].estimate[`${row}005`] + json.data[key][row].estimate[`${row}006`] + json.data[key][row].estimate[`${row}010`]  + json.data[key][row].estimate[`${row}011`])
            }
            
          }
        }
        return feature;
      })})
      console.log(newMax, "maAMAMAMAx");
      
      setMax(newMax);
    }

    const getTitle = () => {
        if (json) {
          if (multiTable) {
            return "Population That have Achived a College Degree";
          }
          return json["tables"][data_ids.table_ids]["title"]
        }
        return "loading";
    }

    const getRow = () => {
      if (json) {
        if (multiTable) {
          if(selectedRow.charAt(selectedRow.length - 1) === "A"){
            return "White"
          }
          if(selectedRow.charAt(selectedRow.length - 1) === "B"){
            return "Black"
          }
          if(selectedRow.charAt(selectedRow.length - 1) === "C"){
            return "Native American or Alaskan Native" 
          }
          if(selectedRow.charAt(selectedRow.length - 1) === "D"){
            return "Asian"
          }

        }
        return (json["tables"][data_ids.table_ids]["columns"][selectedRow]['name']);
      }
        return "loading";
    }


    return (
      <VStack alignItems={'center'} p={3}>
        <Title title={getTitle()} row={getRow()}/>
        <div style={{ height: '70vh', width: '70vw', position: 'relative' }}>
          <DeckGL
              initialViewState={viewport}
              controller={true}
              layers={layers}
              getTooltip={getTooltip}
            >
              <StaticMap mapboxApiAccessToken={APIKEY} />
          </DeckGL>
          {/* <select name="Type" id=""></select> */}
        </div>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />}>
                  {getRow()}
                  {/* Open */}
                </MenuButton>
                <MenuList>
                  {table && table.map((val:any, i:any) => (
                    <MenuItem onClick={() => {
                      updateDataCatagory(val.id)
                    }}>{val.label}</MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>
          <Spacer/>
      </VStack>
      );
}

export type { MapProps };
