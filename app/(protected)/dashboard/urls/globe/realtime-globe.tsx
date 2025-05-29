"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useElementSize } from "@mantine/hooks";
import { scaleSequentialSqrt } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";
import { GlobeInstance } from "globe.gl";
import { debounce } from "lodash-es";
import { useTheme } from "next-themes";

import { Location } from "./index";

interface GlobeProps {
  time: {
    startAt: number;
    endAt: number;
  };
  filters: Record<string, any>;
  locations: Location[];
  stats: {
    totalClicks: number;
    uniqueLocations: number;
    rawRecords: number;
    lastFetch: string;
  };
  setHandleTrafficEvent: (
    fn: (lat: number, lng: number, city: string) => void,
  ) => void;
}

export default function RealtimeGlobe({
  time,
  filters,
  locations,
  stats,
}: GlobeProps) {
  const { theme } = useTheme();
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const mountedRef = useRef(true);
  let globe: GlobeInstance;
  const [countries, setCountries] = useState<any>({});
  const [currentLocation, setCurrentLocation] = useState<any>({});
  const [hexAltitude, setHexAltitude] = useState(0.001);
  const { ref: wrapperRef, width: wrapperWidth } = useElementSize();
  const [isLoaded, setIsLoaded] = useState(false);

  const highest =
    locations.reduce((acc, curr) => Math.max(acc, curr.count), 0) || 1;
  const weightColor = scaleSequentialSqrt(interpolateTurbo).domain([
    0,
    highest * 15,
  ]);

  const loadGlobe = useCallback(async () => {
    try {
      const GlobeModule = await import("globe.gl");
      const Globe = GlobeModule.default;
      const { MeshPhongMaterial } = await import("three");
      return { Globe, MeshPhongMaterial };
    } catch (err) {
      // console.error("Failed to load Globe.gl:", err);
      return null;
    }
  }, []);

  const getGlobeJSON = async () => {
    try {
      const response = await fetch("/countries.geojson");
      const data = await response.json();
      if (mountedRef.current) {
        setCountries(data);
      }
    } catch (error) {
      console.error("Error fetching globe JSON:", error);
      if (mountedRef.current) {
        setCountries({ type: "FeatureCollection", features: [] });
      }
    }
  };

  const getCurrentLocation = async () => {
    try {
      const response = await fetch("/api/location");
      const data = await response.json();
      if (mountedRef.current) {
        setCurrentLocation(data);
      }
    } catch (error) {
      console.error("Error fetching current location:", error);
      if (mountedRef.current) {
        setCurrentLocation({ latitude: 0, longitude: 0 });
      }
    }
  };

  const initGlobe = useCallback(async () => {
    if (
      !globeRef.current ||
      !countries.features ||
      globeInstanceRef.current ||
      !mountedRef.current
    ) {
      return;
    }

    try {
      const modules = await loadGlobe();
      if (!modules || !mountedRef.current) return;

      const { Globe, MeshPhongMaterial } = modules;

      const container = globeRef.current;
      if (!container) return;

      container.innerHTML = "";

      const rect = container.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        setTimeout(initGlobe, 200);
        return;
      }

      globe = new Globe(container)
        .width(wrapperWidth)
        .height(wrapperWidth > 728 ? wrapperWidth * 0.9 : wrapperWidth)
        .globeOffset([0, -80])
        .atmosphereColor("rgba(170, 170, 200, 0.7)")
        .backgroundColor("rgba(0,0,0,0)")
        .globeMaterial(
          new MeshPhongMaterial({
            color: theme === "dark" ? "rgb(65, 65, 65)" : "rgb(228, 228, 231)",
            transparent: false,
            opacity: 1,
          }) as any,
        );

      if (countries.features && countries.features.length > 0) {
        globe
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.2)
          .hexPolygonAltitude(() => hexAltitude)
          .hexPolygonColor(
            () => `rgba(45, 154, 249, ${Math.random() / 1.5 + 0.5})`,
          );
      }

      globe
        .hexBinResolution(4)
        .hexBinPointsData(locations)
        .hexBinMerge(true)
        .hexBinPointWeight("count")
        .hexTopColor((d: any) => {
          const intensity = d.sumWeight || 0;
          return weightColor(intensity);
        })
        .hexSideColor((d: any) => {
          const intensity = d.sumWeight || 0;
          return weightColor(intensity * 0.8);
        })
        .hexAltitude((d: any) => {
          const intensity = d.sumWeight || 0;
          return Math.max(0.01, intensity * 0.8);
        });

      globe.onGlobeReady(() => {
        if (!mountedRef.current) return;

        const lat = currentLocation.latitude || 0;
        const lng = currentLocation.longitude || 0;

        globe.pointOfView({
          lat: lat,
          lng: lng,
          altitude: rect.width > 768 ? 2.5 : 3.5,
        });

        if (globe.controls()) {
          globe.controls().autoRotate = true;
          globe.controls().autoRotateSpeed = 0.5;
          globe.controls().enableDamping = true;
          globe.controls().dampingFactor = 0.1;
        }

        setIsLoaded(true);
      });

      if (globe.controls()) {
        globe.controls().addEventListener(
          "end",
          debounce(() => {
            if (!mountedRef.current || !globeInstanceRef.current) return;

            try {
              const distance = Math.round(globe.controls().getDistance());
              let nextAlt = 0.005;
              if (distance <= 300) nextAlt = 0.001;
              else if (distance >= 600) nextAlt = 0.02;

              if (nextAlt !== hexAltitude) {
                setHexAltitude(nextAlt);
              }
            } catch (err) {
              console.warn("Error in controls event:", err);
            }
          }, 200),
        );
      }

      globeInstanceRef.current = globe;
    } catch (err) {}
  }, [
    countries,
    locations,
    currentLocation,
    hexAltitude,
    loadGlobe,
    weightColor,
  ]);

  const cleanup = useCallback(() => {
    if (globeInstanceRef.current) {
      try {
        if (typeof globeInstanceRef.current._destructor === "function") {
          globeInstanceRef.current._destructor();
        }

        if (globeRef.current) {
          globeRef.current.innerHTML = "";
        }
      } catch (err) {
        console.warn("Error during cleanup:", err);
      }
      globeInstanceRef.current = null;
    }

    setIsLoaded(false);
  }, []);

  // useEffect(() => {
  //   if (globeInstanceRef.current) {
  //     globeInstanceRef.current.width(wrapperWidth);
  //     globeInstanceRef.current.height(
  //       wrapperWidth > 728 ? wrapperWidth * 0.8 : wrapperWidth,
  //     );
  //   }
  // }, [globeInstanceRef.current, wrapperWidth, wrapperHeight]);

  useEffect(() => {
    if (
      globeInstanceRef.current &&
      mountedRef.current &&
      locations.length > 0
    ) {
      try {
        globeInstanceRef.current.hexBinPointsData(locations);
      } catch (err) {
        console.warn("Error updating locations:", err);
      }
    }
  }, [locations]);

  useEffect(() => {
    const initializeData = async () => {
      if (!mountedRef.current) return;

      try {
        await Promise.all([getCurrentLocation(), getGlobeJSON()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (
      countries.features &&
      currentLocation &&
      !globeInstanceRef.current &&
      mountedRef.current
    ) {
      const timer = setTimeout(initGlobe, 100);
      return () => clearTimeout(timer);
    }
  }, [countries, currentLocation, initGlobe]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return (
    <div
      ref={wrapperRef}
      className="relative -mt-8 max-h-screen overflow-hidden"
    >
      <div
        ref={globeRef}
        className="flex justify-center"
        style={{
          maxWidth: `${wrapperWidth}px`, // 比较疑惑
          minHeight: "100px",
        }}
      />
    </div>
  );
}
