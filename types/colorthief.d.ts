declare module 'colorthief' {
    interface ColorThief {
      getColor(sourceImage: HTMLImageElement, quality?: number): number[];
      getPalette(sourceImage: HTMLImageElement, colorCount?: number, quality?: number): number[][];
    }
  
    interface ColorThiefConstructor {
      new(): ColorThief;
    }
  
    const ColorThief: ColorThiefConstructor;
  
    export = ColorThief;
  }