-- CreateTable
CREATE TABLE "han_events"
(
  "id" TEXT NOT NULL ,
  -- 唯一标识符
  "name" TEXT NOT NULL,
  -- 事件名称
  "code" TEXT NOT NULL,
  -- 事件代号
  "firstOccurredAt" TIMESTAMP(3) NOT NULL,
  -- 事件第一次发生时间
  "lastOccurredAt" TIMESTAMP(3),
  -- 事件最近一次发生时间
  "type" TEXT NOT NULL,
  -- 事件类型
  "notes" TEXT,
  -- 备注
  "location" TEXT,
  -- 事件发生地点
  "participants" TEXT NOT NULL,
  -- 事件参与者
  "photos" TEXT,
  -- 事件照片链接
  "status" INTEGER NOT NULL DEFAULT -1,
  -- 事件状态
  "importance" INTEGER NOT NULL DEFAULT -1,
  -- 事件重要性等级
  "reminder" BOOLEAN NOT NULL,
  -- 是否设置提醒
  "reminderTime" TIMESTAMP(3),
  -- 提醒时间
  "recurrent" BOOLEAN NOT NULL,
  -- 是否为重复事件
  "frequency" TEXT,
  -- 重复频率
  "count" INTEGER NOT NULL DEFAULT -1,
  -- 发生次数
  "tags" TEXT,
  -- 标签
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 记录创建时间
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 记录最后更新时间

  CONSTRAINT "han_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xi_hans"
(
  "id" TEXT NOT NULL,
  -- 唯一标识符
  "name" TEXT NOT NULL,
  -- 姓名
  "nickName" TEXT NOT NULL,
  -- 小名
  "code" TEXT NOT NULL,
  -- 代号
  "email" TEXT NOT NULL,
  -- 邮箱
  "phone" TEXT NOT NULL,
  -- 电话
  "address" TEXT NOT NULL,
  -- 地址
  "avatar" TEXT,
  -- 头像
  "sex" INTEGER NOT NULL DEFAULT 0,
  -- 性别
  "age" INTEGER NOT NULL DEFAULT 0,
  -- 年龄
  "birthday" TIMESTAMP(3),
  -- 生日
  "hobby" TEXT,
  -- 爱好
  "games" TEXT,
  -- 游戏
  "tags" TEXT,
  -- 标签
  "food" TEXT,
  -- 食物
  "sport" TEXT,
  -- 运动
  "job" TEXT,
  -- 工作
  "notes" TEXT,
  -- 备注
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 记录创建时间
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 记录最后更新时间

  CONSTRAINT "xi_hans_pkey" PRIMARY KEY ("id")
);
