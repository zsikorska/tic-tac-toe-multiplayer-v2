resource "aws_cloudwatch_log_group" "ttt_backend" { name = "ttt_backend" }
resource "aws_cloudwatch_log_group" "ttt_frontend" { name = "ttt_frontend" }

resource "aws_cloudwatch_log_stream" "ttt_backend" {
  name           = "ttt_backend"
  log_group_name = aws_cloudwatch_log_group.ttt_backend.name
}

resource "aws_cloudwatch_log_stream" "ttt_frontend" {
  name           = "ttt_frontend"
  log_group_name = aws_cloudwatch_log_group.ttt_frontend.name
}
