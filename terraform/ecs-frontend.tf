resource "aws_ecs_task_definition" "ttt_frontend_task" {
  family                   = "ttt_frontend_task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256

  container_definitions = jsonencode(
    [
      {
        name  = "ttt_frontend"
        image = "${aws_ecr_repository.ttt_frontend_repo.repository_url}"
        portMappings = [
          {
            containerPort = 80
            hostPort      = 80
          }
        ],
        memory = 512
        cpu    = 256
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = "ttt_frontend"
            awslogs-region        = "us-east-1"
            awslogs-create-group  = "true"
            awslogs-stream-prefix = "ttt_frontend"
          }
        }
      }
    ]
  )
  execution_role_arn = "arn:aws:iam::740943611122:role/LabRole"
  task_role_arn = "arn:aws:iam::740943611122:role/LabRole"
}

resource "aws_ecs_service" "ttt_frontend_service" {
  name            = "ttt_frontend_service"
  cluster         = aws_ecs_cluster.ttt_cluster.id
  task_definition = aws_ecs_task_definition.ttt_frontend_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.private_subnet_1.id]
    security_groups  = [aws_security_group.ttt_ecs_frontend_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ttt_frontend_tg.arn
    container_name   = "ttt_frontend"
    container_port   = 80
  }
}

resource "aws_alb" "ttt_frontend_alb" {
  name               = "ttt-frontend-alb"
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
  security_groups    = [aws_security_group.ttt_alb_sg.id]
}

resource "aws_lb_target_group" "ttt_frontend_tg" {
  name        = "ttt-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.ttt_vpc.id
  target_type = "ip"
  health_check {
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 60
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 10
  }
}

resource "aws_lb_listener" "ttt_frontend_listener" {
  load_balancer_arn = aws_alb.ttt_frontend_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.cert_arn
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ttt_frontend_tg.arn
  }
}

output "frontend_url" { value = aws_alb.ttt_frontend_alb.dns_name }
