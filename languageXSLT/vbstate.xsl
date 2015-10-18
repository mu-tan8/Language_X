<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:nxl="http://mutan8.exout.net/">
<!--
<xsl:output method="text" />

<xsl:template match=""></xsl:template>

-->
<xsl:template match="nxl:dim">Dim&#0032;<xsl:call-template name="split"><xsl:with-param name="array" select="@name" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template>&#0032;:</xsl:template>

<xsl:template match="nxl:for">For&#0032;<xsl:value-of select="@init" />To&#0032;<xsl:value-of select="@end" />&#0032;<xsl:apply-templates />&#0032;Next :</xsl:template>

<xsl:template match="nxl:break">Exit For :</xsl:template>

<xsl:template match="nxl:while">While&#0032;<xsl:value-of select="@test" />&#0032;<xsl:apply-templates />&#0032;Wend :</xsl:template>

<xsl:template match="nxl:func">Function <xsl:value-of select="@name" /> (<xsl:call-template name="split"><xsl:with-param name="array" select="@arg" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template>) <xsl:apply-templates /> End Function :</xsl:template>

<xsl:template match="nxl:return-value"><xsl:value-of select="../@name" />&#0032;=&#0032;<xsl:value-of select="@select" />&#0032;Exit Function :</xsl:template>

<xsl:template match="nxl:call">Call <xsl:value-of select="@name" />(<xsl:call-template name="split"><xsl:with-param name="array" select="@arg" /><xsl:with-param name="sep" select="' '" /><xsl:with-param name="arysep" select="' , '" /></xsl:call-template>) :</xsl:template>

<xsl:template name="split">
	<xsl:param name="array" /><xsl:param name="sep" /><xsl:param name="arysep" />
	<xsl:choose>
		<xsl:when test="substring-after($array,$sep)=''"><xsl:value-of select="$array" /></xsl:when>
		<xsl:otherwise><xsl:value-of select="substring-before($array,$sep)" />$arysep<xsl:call-template name="split"><xsl:with-param name="array" select="substring-after($array,$sep)" /></xsl:call-template></xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="nxl:switch">Select&#0032;Case&#0032;<xsl:value-of select="@select" />&#0032;<xsl:apply-templates />&#0032;End Select :</xsl:template>

<xsl:template match="nxl:case">Case&#0032;<xsl:value-of select="@value" />&#0032;<xsl:apply-templates />&#0032;</xsl:template>

<xsl:template match="nxl:default">Case&#0032;Else&#0032;<xsl:apply-templates />&#0032;</xsl:template>

<xsl:template match="nxl:if">If&#0032;<xsl:value-of select="@test" />&#0032;<xsl:apply-templates select="nxl:then" />&#0032;<xsl:apply-templates select="nxl:else" />&#0032;End If :</xsl:template>

<xsl:template match="nxl:then">Then&#0032;<xsl:apply-templates />&#0032;</xsl:template>

<xsl:template match="nxl:else">Else<xsl:if test="@test">If&#0032;<xsl:value-of select="@test" /></xsl:if>&#0032;<xsl:apply-templates /></xsl:template>

<xsl:include href="vbexpr.xsl" />

</xsl:stylesheet>