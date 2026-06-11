import { z } from 'zod';

const 身体状态Schema = z.object({
  口腔: z.enum(['纯洁', '经验']).default('纯洁'),
  双乳: z.enum(['纯洁', '经验']).default('纯洁'),
  嫩屄: z.enum(['纯洁', '经验']).default('纯洁'),
  臀部: z.enum(['纯洁', '经验']).default('纯洁'),
  玉足: z.enum(['纯洁', '经验']).default('纯洁'),
});

const 角色变量Schema = z.object({
  好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(0),
  堕落阶段: z.coerce.number().transform(v => _.clamp(v, 0, 3)).default(0),
  是否相识: z.boolean().default(false),
  交互次数: z.coerce.number().default(0),
  身体状态: 身体状态Schema.default({}),
});

export const Schema = z.object({
  系统: z.object({
    当前时间: z.string().default('1938年10月12日 16时15分'),
    当前地点: z.string().default('法租界 霞飞路 静安书局'),
    警觉度: z.enum(['低', '中', '高']).default('低'),
    总轮次: z.coerce.number().default(0),
  }).default({}),

  主角: z.object({
    枪械: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(15),
    潜行: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(20),
    交际: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(35),
    观察: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(30),
    持有金钱: z.coerce.number().default(500),
    持有道具: z.array(z.string()).default([]),
    青帮声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(0),
    巡捕房声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).default(0),
  }).default({}),

  任务: z.object({
    当前主线任务: z.string().default('(考验) 夜莺的考验: 调查圣约翰大学情报泄露源头'),
    主线剩余时间: z.coerce.number().default(71),
    支线任务列表: z.record(z.string(), z.any()).default({}),
    当前委托列表: z.record(z.string(), z.any()).default({}),
  }).default({}),

  沈静姝: 角色变量Schema.default({}),
  顾曼筠: 角色变量Schema.default({}),
  白露凝: 角色变量Schema.default({}),
  藤原千代: 角色变量Schema.default({}),
  萧佩玖: 角色变量Schema.default({}),
  文漪清: 角色变量Schema.default({}),
  凯瑟琳·薇安: 角色变量Schema.default({}),
  陆采薇: 角色变量Schema.default({}),
});

export type Schema = z.output<typeof Schema>;
