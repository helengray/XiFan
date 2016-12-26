//
//  OrientationModule.m
//  XiFan
//
//  Created by helen on 2016/12/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"


@interface RCT_EXTERN_REMAP_MODULE(Orientation,OrientationModule,NSObject)

//导出方法
RCT_EXTERN_METHOD(setOrientation:(NSInteger *)ori)
//导出常量
- (NSDictionary<NSString *, id> *)constantsToExport{
  return @{
           @"LANDSCAPE":@(UIInterfaceOrientationLandscapeLeft),
           @"PORTRAIT":@(UIInterfaceOrientationPortrait)
           };
}
@end
