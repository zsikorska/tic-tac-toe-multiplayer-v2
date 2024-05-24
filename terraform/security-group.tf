resource "aws_security_group" "ttt_alb_sg" {
  name        = "ttt_alb_sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.ttt_vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.ttt_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}


resource "aws_vpc_security_group_ingress_rule" "allow_https_ipv4" {
  security_group_id = aws_security_group.ttt_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.ttt_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_security_group" "ttt_ecs_backend_sg" {
  name        = "ttt_ecs_backend_sg"
  description = "Security group for ECS backend service"
  vpc_id      = aws_vpc.ttt_vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_traffic_from_alb_to_backend_ipv4" {
  security_group_id = aws_security_group.ttt_ecs_backend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 3000
  ip_protocol       = "tcp"
  to_port           = 3000
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_from_backend_ipv4" {
  security_group_id = aws_security_group.ttt_ecs_backend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_security_group" "ttt_ecs_frontend_sg" {
  name        = "ttt_ecs_frontend_sg"
  description = "Security group for ECS frontend service"
  vpc_id      = aws_vpc.ttt_vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_traffic_from_alb_to_frontend_ipv4" {
  security_group_id = aws_security_group.ttt_ecs_frontend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_from_frontend_ipv4" {
  security_group_id = aws_security_group.ttt_ecs_frontend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}
