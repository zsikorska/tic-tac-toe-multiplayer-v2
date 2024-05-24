resource "aws_ecs_task_definition" "ttt_backend_task" {
  family                   = "ttt_backend_task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256

  container_definitions = jsonencode(
    [
      {
        name  = "ttt_backend"
        image = "${aws_ecr_repository.ttt_backend_repo.repository_url}"
        portMappings = [
          {
            containerPort = 3000
            hostPort      = 3000
          }
        ],
        memory = 512
        cpu    = 256
      }
    ]
  )
  execution_role_arn = "arn:aws:iam::740943611122:role/LabRole"
  task_role_arn = "arn:aws:iam::740943611122:role/LabRole"
}

resource "aws_ecs_service" "ttt_backend_service" {
  name            = "ttt_backend_service"
  cluster         = aws_ecs_cluster.ttt_cluster.id
  task_definition = aws_ecs_task_definition.ttt_backend_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.private_subnet_1.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.ttt_ecs_backend_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ttt_backend_tg.arn
    container_name   = "ttt_backend"
    container_port   = 3000
  }
}

resource "aws_alb" "ttt_backend_alb" {
  name               = "ttt-backend-alb"
  load_balancer_type = "application"
  internal           = true
  subnets            = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]       
  security_groups    = [aws_security_group.ttt_alb_sg.id]
}

resource "aws_lb_target_group" "ttt_backend_tg" {
  name        = "ttt-backend-tg"
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

resource "aws_lb_listener" "ttt_backend_listener" {
  load_balancer_arn = aws_alb.ttt_backend_alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ttt_backend_tg.arn
  }
}

output "backend_url" { value = aws_alb.ttt_backend_alb.dns_name }
